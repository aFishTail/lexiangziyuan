from django.apps import AppConfig


class ArticleConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'article'
    label = 'article'
    verbose_name = '文章管理'  # 自定义显示的名称
