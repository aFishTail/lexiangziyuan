from django.contrib import admin

from tag.models import Tag


# Register your models here.
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    # 列表优化
    list_display = ('name', 'synonyms_preview', 'resource_count')
    search_fields = ('name', 'synonyms')

    # 表单优化
    fields = ('name','synonyms')

    def synonyms_preview(self, obj):
        return ', '.join(obj.synonyms) if obj.synonyms else '-'
    synonyms_preview.short_description = '同义词'

    def resource_count(self, obj):
        return obj.articles.count()
    resource_count.short_description = '关联资源数'
