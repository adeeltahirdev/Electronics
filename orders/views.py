import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from products.models import Product
from .models import Order, OrderItem


def checkout(request):
    """Cart/checkout page — all steps handled client-side in cart.html."""
    return render(request, "cart.html")


@require_POST
def place_order(request):
    """
    JSON endpoint called by cart.html JS on 'Place Order'.
    Expected POST body:
    {
        "items":          [{"id": 1, "qty": 2}, ...],
        "billing":        {"first_name": "Ali", "last_name": "Hassan",
                           "phone": "...", "email": "...",
                           "address": "...", "city": "Multan",
                           "province": "Punjab", "notes": ""},
        "payment_method": "cod"
    }
    """
    try:
        data           = json.loads(request.body)
        items          = data.get("items", [])
        billing        = data.get("billing", {})
        payment_method = data.get("payment_method", "cod")

        if not items:
            return JsonResponse({"success": False, "error": "Cart is empty."}, status=400)

        # Recalculate total server-side — never trust client numbers
        validated_items = []
        subtotal = 0
        for item in items:
            product  = Product.objects.get(pk=item["id"])
            qty      = max(1, int(item["qty"]))
            subtotal += float(product.price) * qty
            validated_items.append((product, qty, float(product.price)))

        shipping    = 250 if subtotal > 0 else 0
        total_price = subtotal + shipping

        user = request.user if request.user.is_authenticated else None

        # Combine first + last name into billing_name to match the model
        full_name = f"{billing.get('first_name', '')} {billing.get('last_name', '')}".strip()

        order = Order.objects.create(
            user           = user,
            total_price    = total_price,
            payment_method = payment_method,
            billing_name    = full_name,
            billing_phone   = billing.get("phone", ""),
            billing_email   = billing.get("email", ""),
            billing_address = billing.get("address", ""),
            billing_city    = billing.get("city", ""),
            billing_province = billing.get("province", ""),
            notes           = billing.get("notes", ""),
        )

        for product, qty, price in validated_items:
            OrderItem.objects.create(
                order    = order,
                product  = product,
                quantity = qty,
                price    = price,
            )

            # Decrement stock (don't go below 0)
            if product.stock >= qty:
                product.stock -= qty
                product.save(update_fields=["stock"])

        return JsonResponse({"success": True, "order_id": f"#ORD-{order.pk:06d}"})

    except Product.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "A product in your cart no longer exists."},
            status=400,
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)