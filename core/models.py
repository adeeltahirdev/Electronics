from django.db import models

# Create your models here.
class Banner(models.Model):

    title = models.CharField(max_length=200)

    subtitle = models.CharField(max_length=200)

    description = models.TextField()

    image = models.ImageField(upload_to="banners/")
    
class ContactMessage(models.Model):

    name = models.CharField(max_length=200)

    email = models.EmailField()

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)