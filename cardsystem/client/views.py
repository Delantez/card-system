from django.shortcuts import render
from rest_framework import viewsets

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

def details(request):
    return render(request, 'details.html') 