from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.db.models import Sum, Count
from django.utils import timezone
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
from products.models import Product
from orders.models import Order, OrderItem
from .models import AdminLog, DashboardSettings
import json

User = get_user_model()

def admin_required(view_func):
    """Decorator to check if user is staff or superuser"""
    decorated_func = user_passes_test(
        lambda u: u.is_authenticated and u.is_staff,
        login_url='home'
    )(view_func)
    return decorated_func

@login_required
@admin_required
def dashboard_home(request):
    """Main admin dashboard"""
    # Get counts
    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_customers = User.objects.filter(is_staff=False).count()
    
    # Calculate total revenue from all orders (since payment_status might not exist yet)
    total_revenue = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0
    
    # Recent orders
    recent_orders = Order.objects.order_by('-created_at')[:10]
    
    # Low stock products
    low_stock_products = Product.objects.filter(stock__lt=10)[:10]
    
    # Orders by status
    pending_orders = Order.objects.filter(status='pending').count()
    processing_orders = Order.objects.filter(status='processing').count()
    shipped_orders = Order.objects.filter(status='shipped').count()
    delivered_orders = Order.objects.filter(status='delivered').count()
    cancelled_orders = Order.objects.filter(status='cancelled').count()
    
    # Recent activity
    recent_activity = AdminLog.objects.order_by('-created_at')[:10]
    
    context = {
        'total_products': total_products,
        'total_orders': total_orders,
        'total_customers': total_customers,
        'total_revenue': total_revenue,
        'recent_orders': recent_orders,
        'low_stock_products': low_stock_products,
        'pending_orders': pending_orders,
        'processing_orders': processing_orders,
        'shipped_orders': shipped_orders,
        'delivered_orders': delivered_orders,
        'cancelled_orders': cancelled_orders,
        'recent_activity': recent_activity,
    }
    
    return render(request, 'dashboard/index.html', context)

@login_required
@admin_required
def product_list(request):
    """List all products"""
    products = Product.objects.all().order_by('-created_at' if hasattr(Product, 'created_at') else 'id')
    return render(request, 'dashboard/products/list.html', {'products': products})

@login_required
@admin_required
def product_add(request):
    """Add new product"""
    if request.method == 'POST':
        try:
            product = Product.objects.create(
                name=request.POST.get('name'),
                price=request.POST.get('price'),
                stock=request.POST.get('stock', 0),
                description=request.POST.get('description', ''),
                image=request.FILES.get('image')
            )
            
            # Log action
            AdminLog.objects.create(
                admin=request.user,
                action='create',
                model_name='Product',
                object_id=product.id,
                details=f'Added product: {product.name}'
            )
            
            messages.success(request, 'Product added successfully!')
            return redirect('dashboard_products')
        except Exception as e:
            messages.error(request, f'Error adding product: {str(e)}')
    
    return render(request, 'dashboard/products/add.html')

@login_required
@admin_required
def product_edit(request, product_id):
    """Edit product"""
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        try:
            product.name = request.POST.get('name')
            product.price = request.POST.get('price')
            product.stock = request.POST.get('stock', 0)
            product.description = request.POST.get('description', '')
            
            if request.FILES.get('image'):
                product.image = request.FILES.get('image')
            
            product.save()
            
            # Log action
            AdminLog.objects.create(
                admin=request.user,
                action='update',
                model_name='Product',
                object_id=product.id,
                details=f'Updated product: {product.name}'
            )
            
            messages.success(request, 'Product updated successfully!')
            return redirect('dashboard_products')
        except Exception as e:
            messages.error(request, f'Error updating product: {str(e)}')
    
    return render(request, 'dashboard/products/edit.html', {'product': product})

@login_required
@admin_required
def product_delete(request, product_id):
    """Delete product"""
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        product_name = product.name
        product.delete()
        
        # Log action
        AdminLog.objects.create(
            admin=request.user,
            action='delete',
            model_name='Product',
            object_id=product_id,
            details=f'Deleted product: {product_name}'
        )
        
        messages.success(request, 'Product deleted successfully!')
        return redirect('dashboard_products')
    
    return render(request, 'dashboard/products/delete.html', {'product': product})

@login_required
@admin_required
def order_list(request):
    """List all orders"""
    orders = Order.objects.all().order_by('-created_at')
    return render(request, 'dashboard/orders/list.html', {'orders': orders})

@login_required
@admin_required
def order_detail(request, order_id):
    """View order details"""
    order = get_object_or_404(Order, id=order_id)
    
    if request.method == 'POST':
        new_status = request.POST.get('status')
        if new_status and new_status != order.status:
            old_status = order.status
            order.status = new_status
            order.save()
            
            # Log action
            AdminLog.objects.create(
                admin=request.user,
                action='update',
                model_name='Order',
                object_id=order.id,
                details=f'Updated order #{order.id} status from {old_status} to {new_status}'
            )
            
            messages.success(request, f'Order #{order.id} status updated to {new_status}!')
            return redirect('dashboard_order_detail', order_id=order.id)
    
    return render(request, 'dashboard/orders/detail.html', {'order': order})

@login_required
@admin_required
def customer_list(request):
    """List all customers"""
    customers = User.objects.filter(is_staff=False).order_by('-date_joined')
    
    # Add order count and total spent for each customer
    for customer in customers:
        customer.order_count = Order.objects.filter(user=customer).count()
        customer.total_spent = Order.objects.filter(
            user=customer
        ).aggregate(total=Sum('total_price'))['total'] or 0
    
    return render(request, 'dashboard/customers/list.html', {'customers': customers})

@login_required
@admin_required
def analytics(request):
    """Analytics dashboard"""
    # Last 30 days
    end_date = timezone.now()
    start_date = end_date - timedelta(days=30)
    
    # Daily sales
    daily_sales = []
    for i in range(30):
        date = start_date + timedelta(days=i)
        daily_total = Order.objects.filter(
            created_at__date=date
        ).aggregate(total=Sum('total_price'))['total'] or 0
        daily_sales.append({
            'date': date.strftime('%Y-%m-%d'),
            'total': float(daily_total)
        })
    
    # Top products
    top_products = OrderItem.objects.values('product__name').annotate(
        total_sold=Sum('quantity'),
        total_revenue=Sum('price')
    ).order_by('-total_sold')[:10]
    
    # Sales by payment method
    payment_methods = Order.objects.values('payment_method').annotate(
        count=Count('id'),
        total=Sum('total_price')
    )
    
    # Add display names for payment methods
    payment_method_display = {
        'cod': 'Cash on Delivery',
        'jazzcash': 'JazzCash',
        'easypaisa': 'EasyPaisa',
        'bank': 'Bank Transfer',
    }
    
    for method in payment_methods:
        method['display_name'] = payment_method_display.get(method['payment_method'], method['payment_method'])
    
    # Monthly revenue
    from django.db.models.functions import TruncMonth
    monthly_revenue = Order.objects.annotate(
        month=TruncMonth('created_at')
    ).values('month').annotate(
        total=Sum('total_price')
    ).order_by('month')
    
    context = {
        'daily_sales': json.dumps(daily_sales),
        'top_products': top_products,
        'payment_methods': payment_methods,
        'monthly_revenue': monthly_revenue,
    }
    
    return render(request, 'dashboard/analytics.html', context)