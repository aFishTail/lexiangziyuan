from rest_framework import viewsets

from common.response import success_response
from .models import Category
from .serializers import CategorySerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    分类视图集（只读）

    list: 获取分类列表（不分页）
    retrieve: 获取分类详情
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None  # 禁用分页
