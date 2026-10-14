from django.db import models


class Product(models.Model):
    title = models.CharField("Название", max_length=200)
    description = models.TextField("Описание", blank=True)
    price = models.DecimalField(
        "Цена",
        max_digits=10,
        decimal_places=2,
    )
    image_url = models.URLField(
        "Ссылка на изображение",
        blank=True,
    )
    category = models.CharField(
        "Категория",
        max_length=100,
        blank=True,
    )
    is_active = models.BooleanField(
        "Активен",
        default=True,
    )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"


class Cart(models.Model):
    session_key = models.CharField(
        "Ключ сессии",
        max_length=40,
        unique=True,
    )
    created_at = models.DateTimeField(
        "Создана",
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        "Обновлена",
        auto_now=True,
    )

    def __str__(self):
        return f"Корзина №{self.id}"

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
    )
    quantity = models.PositiveIntegerField(
        "Количество",
        default=1,
    )

    def __str__(self):
        return f"{self.product.title} × {self.quantity}"

    class Meta:
        verbose_name = "Товар в корзине"
        verbose_name_plural = "Товары в корзинах"
        constraints = [
            models.UniqueConstraint(
                fields=["cart", "product"],
                name="unique_product_in_cart",
            )
        ]