from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Category
from .serializers import CategorySerializer

# Create your views here.
class CategoryViewSet(ModelViewSet):
    print("get data")
    queryset = Category.objects.all()
    serializer_class = CategorySerializer 