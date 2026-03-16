from django.db import models

class Category(models.Model):

    name = models.CharField(max_length=200)

    slug = models.SlugField(unique=True)

    image = models.ImageField(upload_to="categories/")

    def __str__(self):
        return self.name
    
class Product(models.Model):

    name = models.CharField(max_length=255)

    slug = models.SlugField(unique=True)

    category = models.ManyToManyField(Category, blank=True, related_name="products")
    description = models.TextField()

    price = models.DecimalField(max_digits=10, decimal_places=2)

    image = models.ImageField(upload_to="products/")

    stock = models.IntegerField()

    is_new = models.BooleanField(default=False)

    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="gallery")

    image = models.ImageField(upload_to="product_gallery/")
