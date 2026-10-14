from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product, Cart, CartItem
from .serializers import ProductSerializer, CartSerializer


def get_or_create_cart(request):
    # Получаем сессию посетителя.
    if not request.session.session_key:
        request.session.create()

    # Находим корзину посетителя или создаём новую.
    cart, _ = Cart.objects.get_or_create(
        session_key=request.session.session_key
    )
    return cart


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


class CartView(APIView):
    # Получение корзины.
    def get(self, request):
        cart = get_or_create_cart(request)
        return Response(CartSerializer(cart).data)


class CartItemAddView(APIView):
    # Добавление товара.
    def post(self, request):
        try:
            product_id = int(request.data.get("product_id"))
            quantity = int(request.data.get("quantity", 1))
        except (TypeError, ValueError):
            return Response(
                {"detail": "Укажи корректные product_id и quantity."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            return Response(
                {"detail": "Количество должно быть не меньше 1."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = get_object_or_404(
            Product,
            pk=product_id,
            is_active=True,
        )

        cart = get_or_create_cart(request)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": quantity},
        )

        if not created:
            item.quantity += quantity
            item.save(update_fields=["quantity"])

        return Response(
            CartSerializer(cart).data,
            status=status.HTTP_201_CREATED,
        )


class CartItemDetailView(APIView):
    # Изменение количества существующей позиции.
    def patch(self, request, item_id):
        cart = get_or_create_cart(request)
        item = get_object_or_404(
            CartItem,
            pk=item_id,
            cart=cart,
        )

        try:
            quantity = int(request.data.get("quantity"))
        except (TypeError, ValueError):
            return Response(
                {"detail": "Укажи целое количество."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity < 1:
            return Response(
                {"detail": "Количество должно быть не меньше 1."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        item.quantity = quantity
        item.save(update_fields=["quantity"])

        return Response(CartSerializer(cart).data)

    # Удаление позиции.
    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        item = get_object_or_404(
            CartItem,
            pk=item_id,
            cart=cart,
        )
        item.delete()

        return Response(CartSerializer(cart).data)