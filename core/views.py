from django.shortcuts import render
from products.models import Product, Category
from core.models import Banner


def home(request):
    context = {
        "banners":           Banner.objects.all(),
        "categories":        Category.objects.all(),
        "new_products":      Product.objects.filter(is_new=True)[:10],
        "featured_products": Product.objects.filter(is_featured=True)[:10],
    }
    return render(request, "index.html", context)