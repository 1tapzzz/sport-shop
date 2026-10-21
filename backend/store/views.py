from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product, Cart, CartItem
from .serializers import (
    ProductSerializer,
    CartSerializer,
    RegisterSerializer,
)

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie


from django.contrib.auth import login, authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated

def get_or_create_cart(request):
    return Cart.objects.get_or_create(user=request.user)[0]


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    # Получение корзины.
    def get(self, request):
        cart = get_or_create_cart(request)
        return Response(CartSerializer(cart).data)


class CartItemAddView(APIView):
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

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


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        login(request, user)

        return Response(
            {
                "message": "Регистрация прошла успешно!",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        if not email or not password:
            return Response(
                {"detail": "Введи email и пароль."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # При регистрации username создаётся равным email.
        user = authenticate(
            request,
            username=email,
            password=password,
        )

        if user is None:
            return Response(
                {"detail": "Неверный email или пароль."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)

        return Response({
            "message": "Вход выполнен успешно!",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
            },
        })

from django.contrib.auth import logout


class ProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"is_authenticated": False})

        return Response({
            "is_authenticated": True,
            "user": {
                "id": request.user.id,
                "email": request.user.email,
                "username": request.user.username,
            },
        })


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({
            "message": "Вы вышли из аккаунта.",
            "is_authenticated": False,
        })