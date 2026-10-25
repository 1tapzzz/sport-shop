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
    user = models.OneToOneField(
        "auth.User",
        on_delete=models.CASCADE,
        related_name="cart",
        null=True,
        blank=True,
        verbose_name="Пользователь",
    )
    session_key = models.CharField(
        "Ключ сессии",
        max_length=40,
        unique=True,
        null=True,
        blank=True,
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
        if self.user:
            return f"Корзина пользователя {self.user}"
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

class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Ожидает оплаты"),
        ("paid", "Оплачен (демо)"),
        ("failed", "Оплата не прошла"),
    ]

    user = models.ForeignKey(
        "auth.User",
        on_delete=models.CASCADE,
        related_name="orders",
    )
    full_name = models.CharField("Имя получателя", max_length=200)
    address = models.CharField("Адрес доставки", max_length=300)
    total = models.DecimalField(
        "Сумма заказа",
        max_digits=10,
        decimal_places=2,
    )
    status = models.CharField(
        "Статус",
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)

    def __str__(self):
        return f"Заказ №{self.id} — {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
    )
    product_title = models.CharField("Название товара", max_length=200)
    price = models.DecimalField(
        "Цена на момент заказа",
        max_digits=10,
        decimal_places=2,
    )
    quantity = models.PositiveIntegerField("Количество")

    def __str__(self):
        return f"{self.product_title} × {self.quantity}"