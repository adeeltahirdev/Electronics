from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone = models.CharField(max_length=15, blank=True)
    
class Address(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    phone = models.CharField(max_length=15)

    email = models.EmailField()

    address = models.TextField()

    city = models.CharField(max_length=100)

    province = models.CharField(max_length=100)

    postcode = models.CharField(max_length=20)