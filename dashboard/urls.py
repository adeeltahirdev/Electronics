from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_home, name='dashboard_home'),
    path('products/', views.product_list, name='dashboard_products'),
    path('products/add/', views.product_add, name='dashboard_product_add'),
    path('products/edit/<int:product_id>/', views.product_edit, name='dashboard_product_edit'),
    path('products/delete/<int:product_id>/', views.product_delete, name='dashboard_product_delete'),
    path('orders/', views.order_list, name='dashboard_orders'),
    path('orders/<int:order_id>/', views.order_detail, name='dashboard_order_detail'),
    path('customers/', views.customer_list, name='dashboard_customers'),
    path('analytics/', views.analytics, name='dashboard_analytics'),
]