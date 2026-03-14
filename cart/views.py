# cart/views.py
from django.shortcuts import render

def cart_page(request):
    """
    Cart page - JS handles rendering from localStorage
    """
    return render(request, "cart.html")