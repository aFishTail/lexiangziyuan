from django.contrib import admin
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'resource_count', 'created_time')
    search_fields = ('name',)
    list_filter = ('order',)
    ordering = ('order', '-update_time')
    fieldsets = (
        ("核心信息", {
            'fields': ('name', 'order'),
            'classes': ('wide',)
        }),
        ("扩展信息", {
            'classes': ('collapse',),
            'fields': ('description',)
        })
    )

    def resource_count(self, obj):
        return obj.articles.count()
    resource_count.short_description = '关联资源数'
