from django.db import models

# Create your models here.
class Cart(models.Model):

    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    
class CartItem(models.Model):

    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)

    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)

    quantity = models.PositiveIntegerField(default=1)