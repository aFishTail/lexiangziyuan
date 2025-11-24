from django.contrib import admin
from .models import Article
from django.contrib import messages


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    # 列表页配置
    list_display = ('name', 'valid_status', 'tag_list',
                    'source', 'created_time', 'update_time', 'view_count',
                    'status')
    list_filter = ('is_valid', 'category', 'source')
    search_fields = ('name', )  # 增强搜索范围[2](@ref)
    list_editable = ('source', )  # 允许直接编辑来源字段[7](@ref)
    filter_horizontal = ('tags', )  # 横向多选标签组件[8](@ref)

    actions = ['batch_publish', 'batch_unpublish']

    # 表单页配置
    fieldsets = (
        ("基本信息", {
            'fields':
            ('name', 'content', 'category', 'source', 'cover_img', 'status')
        }),
        (
            "高级配置",
            {  # 折叠面板[6](@ref)
                'fields': ('tags', 'remark')
            }),
        ("状态监控", {
            'fields': ('is_valid', 'check_time')
        }))

    def tag_list(self, obj):
        """显示完整类型层级路径"""
        return ','.join([t.name for t in obj.tags.all()])

    tag_list.short_description = '标签'

    def valid_status(self, obj):
        """带图标的有效性状态"""
        return '✅ 有效' if obj.is_valid else '❌ 失效'

    valid_status.short_description = '状态'

    @admin.action(description='批量发布选中文章')
    def batch_publish(self, request, queryset):
        updated = queryset.update(status=1)
        self.message_user(request, f"成功发布 {updated} 篇文章", messages.SUCCESS)

    @admin.action(description='批量下架选中文章')
    def batch_unpublish(self, request, queryset):
        queryset.update(status=3)
        self.message_user(request, f"已下架 {queryset.count()} 篇文章")
