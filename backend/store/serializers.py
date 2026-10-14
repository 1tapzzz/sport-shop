from decimal import Decimal

from rest_framework import serializers

from .models import Product, Cart, CartItem


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "description",
            "price",
            "image_url",
            "category",
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "line_total"]

    def get_line_total(self, obj):
        return obj.product.price * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "total", "count"]

    def get_total(self, obj):
        return sum(
            (
                item.product.price * item.quantity
                for item in obj.items.select_related("product").all()
            ),
            Decimal("0.00"),
        )

    def get_count(self, obj):
        return sum(item.quantity for item in obj.items.all())