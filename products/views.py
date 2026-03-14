import json
from django.shortcuts import render, get_object_or_404
from django.core.serializers.json import DjangoJSONEncoder
from .models import Product

def home(request):
    """
    Home page view - sends products data as JSON for JS
    """
    products = Product.objects.all()
    products_json = json.dumps([
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "img": p.image.url if p.image else "",
            "description": p.description,
            "categories": [c.name for c in p.categories.all()] if hasattr(p, "categories") else [],
            "gallery": [g.url for g in p.gallery.all()] if hasattr(p, "gallery") else [],
            "notes": p.notes.split(",") if hasattr(p, "notes") and p.notes else [],
        } for p in products
    ], cls=DjangoJSONEncoder)

    return render(request, "home.html", {
        "products": products,
        "products_json": products_json
    })


def all_products(request):
    """
    All Products page view - JS handles pagination and sorting
    """
    products = Product.objects.all()
    products_json = json.dumps([
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "img": p.image.url if p.image else "",
        } for p in products
    ], cls=DjangoJSONEncoder)

    return render(request, "all-products.html", {
        "products": products,
        "products_json": products_json
    })


def product_detail(request, pk):
    """
    Product detail page - passes the product ID to JS
    """
    product = get_object_or_404(Product, pk=pk)
    product_json = json.dumps({
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "img": product.image.url if product.image else "",
        "description": product.description,
        "categories": [c.name for c in product.categories.all()] if hasattr(product, "categories") else [],
        "gallery": [g.url for g in product.gallery.all()] if hasattr(product, "gallery") else [],
        "notes": product.notes.split(",") if hasattr(product, "notes") and product.notes else [],
    }, cls=DjangoJSONEncoder)

    return render(request, "product-detail.html", {
        "product": product,
        "product_json": product_json
    })