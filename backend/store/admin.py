from django.contrib import admin
from .models import Product, Cart, CartItem


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "price",
        "category",
        "is_active",
    )
    list_filter = ("category", "is_active")
    search_fields = ("title",)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "session_key", "created_at")


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "cart", "product", "quantity")