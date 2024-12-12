from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.

def home_view(request):
    return render(request, 'index.html')  

def login_view(request):
    return render(request, 'login.html')  

def sign_up_view(request):
    return render(request, 'sign_up.html')  

def dashboard(request):
    item_type = request.GET.get('type', 'contact') 
    context = {
        'item_type': item_type
    }
    return render(request, 'dashboard.html', context)

def add_item_form(request, item_type):

    if item_type not in ['contact', 'flyer', 'identity']:
        return render(request, '404.html')  

    return render(request, 'forms.html', {'item_type': item_type})

def forms(request):
    return render(request, 'forms.html') 

def view_item_table(request, item_type):

    if item_type not in ['contact', 'flyer', 'identity']:
        return render(request, '404.html')  

    return render(request, 'tables.html', {'item_type': item_type})

def tables(request):
    return render(request, 'tables.html')  

def contact(request):
    return render(request, 'contact.html') 

def identity(request):
    return render(request, 'identity.html') 

def flyer(request):
    return render(request, 'flyer.html') 



# Login Authentication  

@api_view(['POST'])
def jwt_login_view(request):
    username = request.data.get("company_name")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    return Response({"error": "Invalid credentials"}, status=400)
