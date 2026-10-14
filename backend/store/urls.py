from django.urls import path

from .views import (
    ProductListView,
    CartView,
    CartItemAddView,
    CartItemDetailView,
)

urlpatterns = [
    path("products/", ProductListView.as_view(), name="products"),
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/", CartItemAddView.as_view(), name="cart-add"),
    path(
        "cart/items/<int:item_id>/",
        CartItemDetailView.as_view(),
        name="cart-item-detail",
    ),
]