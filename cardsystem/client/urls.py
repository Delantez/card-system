from django.urls import path, include
from django.contrib.auth.views import LogoutView
from .views import *

urlpatterns = [
path('home_view/', home_view, name='home_view'),
path('', login_view, name='login_view'),
path('sign_up/', sign_up_view, name='sign_up_view'),
path('dashboard/', dashboard, name='dashboard'),
path('add/<str:item_type>/', add_item_form, name='add_item_form'),
path('forms/', forms, name='forms'),
path('view/<str:item_type>/', view_item_table, name='view_item_table'),
path('tables/', tables, name='tables'),
path('contact/', contact, name='contact'),
path('identity/', identity, name='identity'),
path('flyer/', flyer, name='flyer'),

# Login $ Logout
path('login/', jwt_login_view, name='jwt_login_view'),
path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
] 