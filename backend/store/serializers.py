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


from django.contrib.auth import get_user_model


User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "Пользователь с такой почтой уже зарегистрирован."
            )

        return value

    def create(self, validated_data):
        email = validated_data["email"]

        return User.objects.create_user(
            username=email,
            email=email,
            password=validated_data["password"],
        )