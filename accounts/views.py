from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import auth
from django.contrib import messages
from .models import User


def login_view(request):
    if request.method == 'POST':    
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = auth.authenticate(username=username, password=password)
    
        if user is not None:
            auth.login(request, user)
            return redirect('/')
        else:
            messages.error(request, 'Invalid credentials')
            return redirect('/')
    return render(request, 'index.html')


def register(request):
    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        email    = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")

        if not username or not password:
            messages.error(request, "Username and password are required.")
        elif User.objects.filter(username=username).exists():
            messages.error(request, "That username is already taken.")
        elif User.objects.filter(email=email).exists():
            messages.error(request, "An account with that email already exists.")
        else:
            User.objects.create_user(username=username, email=email, password=password)
            messages.success(request, "Account created! You can now log in.")
            return redirect("home")

    return render(request, "index.html")


def logout_view(request):
    logout(request)
    return redirect("home")