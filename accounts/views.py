from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import User


def login_view(request):
    if request.user.is_authenticated:
        return redirect("home")

    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect(request.POST.get("next") or request.GET.get("next") or "home")
        messages.error(request, "Invalid username or password.")

    return render(request, "login.html", {"next": request.GET.get("next", "")})


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
            return redirect("login")

    return render(request, "register.html")


def logout_view(request):
    logout(request)
    return redirect("home")