from django.contrib import admin
from .models import Identity, Flyer, Contact

# Register your models here.
admin.site.register(Identity)
admin.site.register(Flyer)
admin.site.register(Contact)