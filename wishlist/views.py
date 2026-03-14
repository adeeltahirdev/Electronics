from django.shortcuts import redirect, get_object_or_404, render
from products.models import Product
from .models import Wishlist

def add_to_wishlist(request, product_id):

    product = get_object_or_404(Product, id=product_id)

    Wishlist.objects.get_or_create(
        user=request.user,
        product=product
    )

    return redirect(request.META.get("HTTP_REFERER"))

def wishlist_view(request):

    wishlist_items = Wishlist.objects.filter(user=request.user)

    return render(request, "wishlist/wishlist.html", {
        "wishlist_items": wishlist_items
    })