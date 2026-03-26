import json
import logging
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from products.models import Product
from .models import Order, OrderItem

# Set up logging
logger = logging.getLogger(__name__)

def checkout(request):
    """Cart/checkout page — all steps handled client-side in cart.html."""
    return render(request, "cart.html")


@require_POST
def place_order(request):
    """
    JSON endpoint called by cart.html JS on 'Place Order'.
    """
    try:
        # Log the request
        logger.info("=== PLACE ORDER CALLED ===")
        
        # Parse JSON data
        data = json.loads(request.body)
        logger.info(f"Received data: {json.dumps(data, indent=2)}")
        
        items = data.get("items", [])
        billing = data.get("billing", {})
        payment_method = data.get("payment_method", "cod")
        
        # Validate items
        if not items:
            logger.warning("No items in cart")
            return JsonResponse({"success": False, "error": "Cart is empty."}, status=400)
        
        # Validate billing information
        required_billing_fields = ['first_name', 'last_name', 'phone', 'address', 'city']
        missing_fields = [field for field in required_billing_fields if not billing.get(field)]
        if missing_fields:
            logger.warning(f"Missing billing fields: {missing_fields}")
            return JsonResponse({
                "success": False, 
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }, status=400)
        
        # Process items and calculate total
        validated_items = []
        subtotal = 0
        
        for idx, item in enumerate(items):
            try:
                product_id = item.get("id")
                qty = item.get("qty", 1)
                
                # Validate product ID
                if not product_id:
                    logger.error(f"Item {idx} missing ID")
                    return JsonResponse({
                        "success": False, 
                        "error": f"Item {idx + 1} is missing product ID"
                    }, status=400)
                
                # Convert to integers
                product_id = int(product_id)
                qty = max(1, int(qty))
                
                # Get product from database
                try:
                    product = Product.objects.get(pk=product_id)
                except Product.DoesNotExist:
                    logger.error(f"Product with ID {product_id} not found")
                    return JsonResponse({
                        "success": False, 
                        "error": f"Product with ID {product_id} no longer exists in our database."
                    }, status=400)
                
                # Calculate price
                price = float(product.price)
                item_total = price * qty
                subtotal += item_total
                
                validated_items.append((product, qty, price))
                logger.info(f"Item {idx}: {product.name} x{qty} = Rs {item_total}")
                
            except (ValueError, TypeError) as e:
                logger.error(f"Error processing item {idx}: {str(e)}")
                return JsonResponse({
                    "success": False, 
                    "error": f"Invalid data for item {idx + 1}: {str(e)}"
                }, status=400)
            except Exception as e:
                logger.error(f"Unexpected error with item {idx}: {str(e)}")
                return JsonResponse({
                    "success": False, 
                    "error": f"Error processing item {idx + 1}: {str(e)}"
                }, status=400)
        
        # Calculate shipping and total
        shipping = 250 if subtotal > 0 else 0
        total_price = subtotal + shipping
        
        logger.info(f"Order totals - Subtotal: {subtotal}, Shipping: {shipping}, Total: {total_price}")
        
        # Get user
        user = request.user if request.user.is_authenticated else None
        
        # Create full name
        full_name = f"{billing.get('first_name', '')} {billing.get('last_name', '')}".strip()
        
        # Create order
        try:
            order = Order.objects.create(
                user=user,
                total_price=total_price,
                payment_method=payment_method,
                billing_name=full_name,
                billing_phone=billing.get("phone", ""),
                billing_email=billing.get("email", ""),
                billing_address=billing.get("address", ""),
                billing_city=billing.get("city", ""),
                billing_province=billing.get("province", ""),
                notes=billing.get("notes", ""),
            )
            logger.info(f"Order created with ID: {order.pk}")
        except Exception as e:
            logger.error(f"Failed to create order: {str(e)}")
            return JsonResponse({
                "success": False, 
                "error": f"Failed to create order: {str(e)}"
            }, status=500)
        
        # Create order items and update stock
        try:
            for product, qty, price in validated_items:
                # Create order item
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=qty,
                    price=price,
                )
                logger.info(f"OrderItem created: {product.name} x{qty}")
                
                # Update stock
                if hasattr(product, 'stock'):
                    if product.stock >= qty:
                        product.stock -= qty
                        product.save(update_fields=["stock"])
                        logger.info(f"Stock updated for {product.name}: {product.stock}")
                    else:
                        logger.warning(f"Insufficient stock for {product.name}. Available: {product.stock}, Requested: {qty}")
        except Exception as e:
            logger.error(f"Failed to create order items: {str(e)}")
            # Delete the order if items fail
            order.delete()
            return JsonResponse({
                "success": False, 
                "error": f"Failed to process order items: {str(e)}"
            }, status=500)
        
        # Success response
        response_data = {
            "success": True,
            "order_id": f"#ORD-{order.pk:06d}",
            "message": "Order placed successfully!"
        }
        logger.info(f"Order {order.pk} completed successfully")
        return JsonResponse(response_data)
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON: {str(e)}")
        return JsonResponse({
            "success": False, 
            "error": f"Invalid JSON data: {str(e)}"
        }, status=400)
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return JsonResponse({
            "success": False, 
            "error": f"An unexpected error occurred: {str(e)}"
        }, status=500)