from django.shortcuts import render, redirect
from cart.models import CartItem
from .models import Order, OrderItem

def checkout(request):

    cart_items = CartItem.objects.filter(cart__user=request.user)

    total = sum(item.product.price * item.quantity for item in cart_items)

    return render(request, "orders/checkout.html", {
        "cart_items": cart_items,
        "total": total
    })
    
def place_order(request):

    cart_items = CartItem.objects.filter(cart__user=request.user)

    total = sum(item.product.price * item.quantity for item in cart_items)

    order = Order.objects.create(
        user=request.user,
        total_price=total
    )

    for item in cart_items:

        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

    cart_items.delete()

    return redirect("home")

