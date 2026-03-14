from django.shortcuts import render
from products.models import Product, Category
from .models import Banner


def home(request):

    banners = Banner.objects.all()

    categories = Category.objects.all()

    new_products = Product.objects.filter(is_new=True)[:10]

    featured_products = Product.objects.filter(is_featured=True)[:10]

    context = {
        "banners": banners,
        "categories": categories,
        "new_products": new_products,
        "featured_products": featured_products,
    }

    return render(request, "index.html", context)