from django.contrib.auth.models import User
from django.db import models
from django.utils.timezone import now
from io import BytesIO
from django.core.files import File
import qrcode

class Identity(models.Model):
    STAFF_CHOICES = [
        ('isstaff', 'Active'),
        ('notstaff', 'Inactive'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to logged-in user
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    id_number = models.CharField(max_length=15)
    position = models.CharField(max_length=100, blank=True, null=True)
    # company = models.CharField(max_length=100, blank=True, null=True)
    expiry_date = models.DateField()
    status = models.BooleanField(default=True)
    photo = models.ImageField(upload_to='media/photos/', blank=True, null=True)
    work = models.CharField(max_length=10, choices=STAFF_CHOICES, default='notstaff')
    qrpath = models.ImageField(upload_to='media/qr-identity/', blank=True, null=True)


    def save(self, *args, **kwargs):
        if self.work == 'isstaff' and self.validity_time >= now().date():
            self.status = True
        else:
            self.status = False
        super().save(*args, **kwargs)

    @property
    def is_active(self):
        return self.work == 'isstaff' and self.validity_time >= now().date()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Flyer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='media/files/', blank=True, null=True)
    qrpath = models.ImageField(upload_to='media/qr-flyer/', blank=True, null=True)

    def __str__(self):  
        return f"{self.name}"


class Contact(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to logged-in user
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField()
    organization = models.CharField(max_length=100, blank=True, null=True)
    job = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=50)
    qrcode = models.ImageField(upload_to='media/qr-contact/', blank=True, null=True)
    
    class Meta:
            unique_together = ('user', 'email')  # Ensure email is unique per user
            indexes = [
                models.Index(fields=['user']),  # Optimize queries filtering by user
            ]
    def save(self, *args, **kwargs):
        if not self.organization:
            self.organization = self.user.username

        vcard = f"BEGIN:VCARD\nVERSION:4.0\n"
        vcard += f"N:{self.last_name};{self.first_name};;;\n"
        vcard += f"FN:{self.first_name} {self.last_name}\n"
        if self.phone:
            vcard += f"TEL;TYPE=CELL:{self.phone}\n"
        if self.email:
            vcard += f"EMAIL:{self.email}\n"
        if self.organization:
            vcard += f"ORG:{self.organization}\n"
        if self.job:
            vcard += f"TITLE:{self.job}\n"
        if self.address:
            vcard += f"ADR;TYPE=HOME:;;{self.address};;;;\n"
        vcard += "END:VCARD"

        qr = qrcode.make(vcard.strip())
        buffer = BytesIO()
        qr.save(buffer, format="PNG")
        buffer.seek(0)

        filename = f'{self.first_name}_{self.last_name}_qrcode.png'
        self.qrcode.save(filename, File(buffer), save=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
