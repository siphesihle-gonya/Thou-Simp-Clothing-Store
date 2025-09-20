from rest_framework import viewsets, permissions
from .models import (
    Category, Product, Order, OrderItem,
    ShippingAddress, UserProfile
)
from .serializers import (
     CategorySerializer, ProductSerializer, OrderSerializer,
    OrderItemSerializer, ShippingAddressSerializer, UserProfileSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.serializers import ModelSerializer
from rest_framework.permissions import AllowAny

class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user

# View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class ShippingAddressViewSet(viewsets.ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class PlaceOrderView(APIView):
    def post(self, request):
        shipping_data = request.data.get("shipping")
        items_data = request.data.get("items")

        # Save shipping address
        shipping = ShippingAddress.objects.create(**shipping_data)

        # Use the first user (for test)
        user = User.objects.first()

        # Create order
        order = Order.objects.create(user=user, total_price=0)

        total_price = 0
        for item in items_data:
            product = Product.objects.get(id=item["product_id"])
            quantity = item["quantity"]
            item_price = product.price * quantity
            OrderItem.objects.create(order=order, product=product, quantity=quantity, item_price=item_price)
            total_price += item_price

        order.total_price = total_price
        order.save()

        return Response({"message": "Order placed", "order_id": order.id}, status=status.HTTP_201_CREATED)