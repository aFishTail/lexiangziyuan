from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet

app_name = "article"

router = DefaultRouter()
router.register(r'articles', ArticleViewSet, basename='article')

urlpatterns = [
    # 标准的 REST API
    path('', include(router.urls)),
]
