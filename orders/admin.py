from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model           = OrderItem
    extra           = 0
    readonly_fields = ["product", "quantity", "price"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display    = ["id", "user", "billing_name", "billing_phone",
                       "billing_city", "total_price", "payment_method", "status", "created_at"]
    list_filter     = ["status", "payment_method", "created_at"]
    list_editable   = ["status"]
    search_fields   = ["billing_name", "billing_phone", "billing_email"]
    readonly_fields = ["created_at"]
    inlines         = [OrderItemInline]