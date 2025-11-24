from django.contrib import admin
from .models import SearchKeyword


@admin.register(SearchKeyword)
class SearchKeywordAdmin(admin.ModelAdmin):
    """搜索关键词管理"""
    list_display = ['keyword', 'count', 'last_searched', 'created_time']
    search_fields = ['keyword']
    list_filter = ['created_time', 'last_searched']
    ordering = ['-count', '-last_searched']
    readonly_fields = ['created_time', 'update_time', 'last_searched']
