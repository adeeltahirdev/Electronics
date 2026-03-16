from django.contrib import admin
from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model  = ProductImage
    extra  = 3
    fields = ["image", "order"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display        = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display        = ["name", "price", "stock", "is_new", "is_featured", "created_at"]
    list_filter         = ["is_new", "is_featured", "categories"]
    list_editable       = ["price", "stock", "is_new", "is_featured"]
    search_fields       = ["name", "description"]
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal   = ["categories"]
    inlines             = [ProductImageInline]