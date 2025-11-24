from django.contrib import admin
from .models import ResourceCategory, ResourceWebsite


@admin.register(ResourceCategory)
class ResourceCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'created_time', 'update_time']
    list_filter = ['created_time']
    search_fields = ['name', 'description']
    ordering = ['order', 'id']


@admin.register(ResourceWebsite)
class ResourceWebsiteAdmin(admin.ModelAdmin):
    list_display = ['name', 'url', 'category', 'visit_count',
                    'is_featured', 'status', 'created_time']
    list_filter = ['status', 'is_featured', 'category', 'created_time']
    search_fields = ['name', 'description', 'url', 'tags']
    list_editable = ['status', 'is_featured']
    ordering = ['-created_time']
    readonly_fields = ['visit_count', 'created_time', 'update_time']
