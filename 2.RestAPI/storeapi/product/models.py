from django.db import models
from django.urls import reverse
from PIL import Image
import io
from django.core.files.base import ContentFile
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.image:
            img = Image.open(self.image.path)
            img = img.convert("RGB")
            output_io = io.BytesIO()
            img.save(output_io, format='WEBP', quality=80)
            new_image_name = self.image.name.rsplit('.', 1)[0] + '.webp'
            self.image.save(new_image_name, ContentFile(output_io.getvalue()), save=False)
            super().save(update_fields=['image'])

    class Meta:
        ordering = ['name']
    
    class Meta:
        ordering = ['name']

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')

    def save(self, *args, **kwargs):
        if not self.image:
            super().save(*args, **kwargs)
            return

        super().save(*args, **kwargs)

        from PIL import Image
        import io
        from django.core.files.base import ContentFile
        import os

        img = Image.open(self.image.path)
        img = img.convert("RGB")

        output_io = io.BytesIO()
        img.save(output_io, format='WEBP', quality=80)

        folder = os.path.dirname(self.image.name)
        base = os.path.basename(self.image.name).rsplit('.', 1)[0]
        new_image_name = f"{folder}/{base}.webp"

        old_path = self.image.path
        self.image.save(new_image_name, ContentFile(output_io.getvalue()), save=False)
        if os.path.exists(old_path):
            os.remove(old_path)

        super().save(update_fields=['image'])

    def __str__(self):
        return f"Image for {self.product.name}"

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Телефон")
    image = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name="Аватар")
    isGoogle = models.BooleanField(default=False)

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.image:
            img = Image.open(self.image.path)
            img = img.convert("RGB")
            output_io = io.BytesIO()
            img.save(output_io, format='WEBP', quality=80)

            new_image_name = self.image.name.rsplit('.', 1)[0] + '.webp'

            self.image.save(new_image_name, ContentFile(output_io.getvalue()), save=False)
            super().save(update_fields=['image'])
