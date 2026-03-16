from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return self.username


class Address(models.Model):
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")

    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    phone      = models.CharField(max_length=15)
    email      = models.EmailField()
    address    = models.TextField()
    city       = models.CharField(max_length=100)
    province   = models.CharField(max_length=100)
    postcode   = models.CharField(max_length=20, blank=True)

    # Allows pre-filling the checkout form with the user's saved address
    is_default = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Addresses"

    def save(self, *args, **kwargs):
        # Enforce only one default address per user
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} – {self.city}"