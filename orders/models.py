from django.db import models


class Order(models.Model):

    STATUS_CHOICES = [
        ("pending",    "Pending"),
        ("processing", "Processing"),
        ("shipped",    "Shipped"),
        ("delivered",  "Delivered"),
        ("cancelled",  "Cancelled"),
    ]

    PAYMENT_CHOICES = [
        ("cod",  "Cash on Delivery"),
        ("bank", "Bank Transfer"),
    ]

    # Nullable — allows guest (unauthenticated) checkouts
    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="orders",
    )

    # Billing snapshot stored at order time so records stay
    # accurate even if the user later edits their profile
    billing_name     = models.CharField(max_length=200, blank=True)
    billing_phone    = models.CharField(max_length=15,  blank=True)
    billing_email    = models.EmailField(blank=True)
    billing_address  = models.TextField(blank=True)
    billing_city     = models.CharField(max_length=100, blank=True)
    billing_province = models.CharField(max_length=100, blank=True)
    notes            = models.TextField(blank=True)

    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default="cod")
    total_price    = models.DecimalField(max_digits=10, decimal_places=2)
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.pk} – {self.billing_name or 'Guest'} ({self.status})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")

    # SET_NULL so the order record survives even if a product is later deleted
    product  = models.ForeignKey("products.Product", on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()
    price    = models.DecimalField(max_digits=10, decimal_places=2)  # price at purchase time

    def __str__(self):
        return f"{self.quantity}× {self.product} in Order #{self.order.pk}"

    @property
    def subtotal(self):
        return self.price * self.quantity