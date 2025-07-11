from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Category, User


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at', 'updated_at']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Додаткова інформація', {
            'fields': ('phone', 'image'),
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Додаткова інформація', {
            'fields': ('phone', 'image'),
        }),
    )
    list_display = BaseUserAdmin.list_display + ('phone',)
