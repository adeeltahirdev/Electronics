import json
from django.shortcuts import render, get_object_or_404
from django.core.serializers.json import DjangoJSONEncoder
from django.urls import reverse
from .models import Product


def _product_to_dict(p, include_full=False):
    """Serialize a Product to a plain dict for JSON embedding in templates."""
    data = {
        "id":         p.id,
        "name":       p.name,
        "price":      float(p.price),
        "img":        p.image.url if p.image else "",
        "url":        reverse("product_detail", args=[p.pk]),
        "categories": [c.name for c in p.categories.all()],
    }
    if include_full:
        data.update({
            "description": p.description or "",
            "gallery":     [g.image.url for g in p.gallery.all()],
            "notes":       [n.strip() for n in p.notes.split(",")] if p.notes else [],
        })
    return data


def all_products(request):
    """
    All Products page.
    Supports ?search= (name) and ?category= (slug) filtering.
    Passes the result as JSON for JS-driven sorting & pagination.
    """
    qs = Product.objects.prefetch_related("categories", "gallery").all()

    search_q = request.GET.get("search", "").strip()
    category  = request.GET.get("category", "").strip()

    if search_q:
        qs = qs.filter(name__icontains=search_q)
    if category:
        qs = qs.filter(categories__slug=category).distinct()

    # Convert products to list of dicts
    products_list = [_product_to_dict(p) for p in qs]
    
    # Debug: Print to console to verify data
    print(f"Number of products: {len(products_list)}")
    if products_list:
        print(f"First product: {products_list[0]}")
    
    products_json = json.dumps(
        products_list,
        cls=DjangoJSONEncoder,
    )

    # Use the correct template name with hyphen
    return render(request, "all-products.html", {
        "products":      qs,
        "products_json": products_json,
        "search_q":      search_q,
        "category":      category,
    })


def product_detail(request, pk):
    """Single product page — passes full product data as JSON for JS."""
    product = get_object_or_404(
        Product.objects.prefetch_related("categories", "gallery"),
        pk=pk,
    )

    product_json = json.dumps(
        _product_to_dict(product, include_full=True),
        cls=DjangoJSONEncoder,
    )

    return render(request, "product-detail.html", {
        "product":      product,
        "product_json": product_json,
    })