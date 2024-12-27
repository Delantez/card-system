from django.shortcuts import render, redirect
from django.http import JsonResponse, FileResponse, HttpResponse
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status, viewsets  
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import Identity, Flyer, Contact
from .serializers import CustomUserCreateSerializer, ContactSerializer, IdentitySerializer, FlyerSerializer
from django.shortcuts import render, get_object_or_404
from rest_framework.generics import RetrieveUpdateAPIView
import qrcode
from io import BytesIO
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

# Login Authentication  

@csrf_exempt
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


# Pages

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



# Generic View Sets

class IdentityViewSet(viewsets.ModelViewSet):
    queryset = Identity.objects.all()
    serializer_class = IdentitySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filter Identity objects by logged-in user
        return Identity.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically set the logged-in user
        serializer.save(user=self.request.user)

    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)

def generate_qr_code(request, identity_id):
    # Generate the URL for the identity
    url = request.build_absolute_uri(f'/view_identity/{identity_id}/')

    # Create the QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # Create an image from the QR Code instance
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    # Return the image as an HTTP response
    return HttpResponse(buffer, content_type="image/png")


class FlyerViewSet(viewsets.ModelViewSet):
    queryset = Flyer.objects.all()
    serializer_class = FlyerSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Flyer.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically set the logged-in user
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)

def generate_flyer_qr(request, flyer_id):
    # Generate the QR code
    download_url = request.build_absolute_uri(f'/download_flyer/{flyer_id}/')
    qr = qrcode.make(download_url)
    
    # Create the HTTP response with appropriate headers
    response = HttpResponse(content_type="image/png")
    response['Content-Disposition'] = f'attachment; filename="flyer_qr_{flyer_id}.png"'
    qr.save(response, "PNG")
    return response

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()  # Explicitly define the queryset
    serializer_class = ContactSerializer

    def get_queryset(self):
        return Contact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the logged-in user
        serializer.save(user=self.request.user)
