import json
from django.shortcuts import render, get_object_or_404
from django.core.serializers.json import DjangoJSONEncoder
from django.urls import reverse
from .models import Product


def _product_to_dict(p, include_full=False):
    data = {
        "id":         p.id,
        "name":       p.name,
        "price":      float(p.price),
        "img":        p.image.url if p.image else "",
        "url":        reverse("product_detail", args=[p.pk]),
        "categories": [c.name for c in p.category.all()],
    }
    if include_full:
        data.update({
            "description": p.description or "",
            "gallery":     [g.image.url for g in p.gallery.all()],
            "notes":       [n.strip() for n in p.notes.split(",")] if p.notes else [],
        })
    return data


def all_products(request):
    qs = Product.objects.prefetch_related("category").all()

    search_q = request.GET.get("search", "").strip()
    category  = request.GET.get("category", "").strip()

    if search_q:
        qs = qs.filter(name__icontains=search_q)
    if category:
        qs = qs.filter(category__slug=category).distinct()

    products_json = json.dumps(
        [_product_to_dict(p) for p in qs],
        cls=DjangoJSONEncoder,
    )

    return render(request, "all-products.html", {
        "products":      qs,
        "products_json": products_json,
        "search_q":      search_q,
        "category":      category,
    })


def product_detail(request, pk):
    product = get_object_or_404(
        Product.objects.prefetch_related("category", "gallery"),
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
