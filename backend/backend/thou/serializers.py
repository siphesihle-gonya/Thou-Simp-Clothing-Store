from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Category, Product, Order, OrderItem,
    ShippingAddress, UserProfile
)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Product
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        else:
            return None

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = ShippingAddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

class CheckoutItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField()


class CheckoutSerializer(serializers.Serializer):
    customer = UserProfileSerializer()
    items = CheckoutItemInputSerializer(many=True)

    def create(self, validated_data):
        customer_data = validated_data['customer']
        items_data = validated_data['items']

        user_profile = UserProfile.objects.create(**customer_data)

        total = 0
        order = Order.objects.create(user=user_profile.user, total_price=0)  # Placeholder

        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            quantity = item['quantity']
            subtotal = product.price * quantity
            total += subtotal

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                item_price=subtotal
            )

        order.total_price = total
        order.save()
        return order
