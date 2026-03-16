from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name  = models.CharField(max_length=200)
    slug  = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to="categories/", blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    name        = models.CharField(max_length=255)
    slug        = models.SlugField(unique=True, blank=True)

    # ManyToMany so one product can belong to multiple categories
    # e.g. "ESP32-CAM" -> both Microcontrollers AND Camera Modules
    categories  = models.ManyToManyField(Category, blank=True, related_name="products")

    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=10, decimal_places=2)
    image       = models.ImageField(upload_to="products/", blank=True, null=True)
    stock       = models.PositiveIntegerField(default=0)

    # Comma-separated bullet points shown on the product detail page
    # e.g. "Voltage: 5V,Current: 500mA,Weight: 25g"
    notes       = models.CharField(max_length=500, blank=True)

    is_new      = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)

    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def in_stock(self):
        return self.stock > 0


class ProductImage(models.Model):
    """Extra gallery images shown on the product detail page."""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="gallery",  # product.gallery.all() works in views & templates
    )
    image = models.ImageField(upload_to="product_gallery/")
    order = models.PositiveSmallIntegerField(default=0, help_text="Display order — lower = first")

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Image for {self.product.name}"