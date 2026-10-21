
from django.urls import path

from .views import ProductListView, CartView, CartItemAddView, CartItemDetailView, RegisterView, LoginView, ProfileView, LogoutView

urlpatterns = [
    path("products/", ProductListView.as_view(), name="products"),
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/", CartItemAddView.as_view(), name="cart-add"),
    path(
        "cart/items/<int:item_id>/",
        CartItemDetailView.as_view(),
        name="cart-item-detail",
    ),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/profile/", ProfileView.as_view(), name="profile"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
]
