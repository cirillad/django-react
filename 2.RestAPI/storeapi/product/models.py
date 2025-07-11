from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class User(AbstractUser):
    username = models.CharField(max_length=150, unique=False, blank=True, null=True)  # зробили необов’язковим
    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=20, blank=True)
    image = models.ImageField(upload_to='users/', null=True, blank=True)
    google_picture_url = models.URLField(blank=True, null=True)

    USERNAME_FIELD = 'email'        # використовуємо email як основний для логіну
    REQUIRED_FIELDS = []             # щоб не вимагав username при створенні через createsuperuser

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
