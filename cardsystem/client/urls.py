from django.urls import path, include
from .views import *

urlpatterns = [
path('', home_view, name='home_view'),
path('login/', login_view, name='login_view'),
path('sign_up/', sign_up_view, name='sign_up_view'),
path('dashboard/', dashboard, name='dashboard'),
path('add/<str:item_type>/', add_item_form, name='add_item_form'),
path('forms/', forms, name='forms'),
path('view/<str:item_type>/', view_item_table, name='view_item_table'),
path('tables/', tables, name='tables'),
path('details/', details, name='details'),
] 