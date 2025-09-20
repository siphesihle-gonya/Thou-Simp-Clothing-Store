from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    PlaceOrderView, CategoryViewSet, ProductViewSet, OrderViewSet,
    OrderItemViewSet, ShippingAddressViewSet, UserProfileViewSet
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'shipping', ShippingAddressViewSet)
router.register(r'user-profiles', UserProfileViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path("api/place-order/", PlaceOrderView.as_view(), name="place-order"),
    path('api/auth/register/', views.RegisterView.as_view(), name='register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
