from rest_framework import viewsets, status
from rest_framework.decorators import action

from common.response import success_response, error_response
from .models import ResourceCategory, ResourceWebsite
from .serializers import (
    ResourceCategorySerializer,
    ResourceWebsiteSerializer,
    ResourceWebsiteDetailSerializer
)
from .filters import ResourceWebsiteFilter


class ResourceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    资源网站分类视图集（只读）

    list: 获取分类列表（不分页）
    retrieve: 获取分类详情
    """
    queryset = ResourceCategory.objects.all()
    serializer_class = ResourceCategorySerializer
    pagination_class = None  # 禁用分页


class ResourceWebsiteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    资源网站视图集（只读）

    list: 获取资源网站列表（不分页，支持过滤）
    retrieve: 获取资源网站详情
    featured: 获取推荐的资源网站
    hot: 获取热门资源网站
    """
    queryset = ResourceWebsite.objects.select_related('category').all()
    filterset_class = ResourceWebsiteFilter
    search_fields = ['name', 'description']
    pagination_class = None  # 禁用分页

    def get_serializer_class(self):
        """根据不同操作返回不同的序列化器"""
        if self.action == 'retrieve':
            return ResourceWebsiteDetailSerializer
        return ResourceWebsiteSerializer

    def get_queryset(self):
        """默认只返回已发布的资源网站"""
        queryset = super().get_queryset()
        # 非管理员只能看到已发布的
        if not self.request.user.is_staff:
            queryset = queryset.filter(status=1)
        return queryset

    def retrieve(self, request, *args, **kwargs):
        """获取详情（不自动增加访问量，需要前端主动调用 increment_visit）"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success_response(data=serializer.data, message='获取成功')

    @action(detail=True, methods=['post'], url_path='increment_visit')
    def increment_visit(self, request, pk=None):
        """增加资源访问量"""
        resource_website = self.get_object()
        resource_website.increment_visit_count()
        return success_response(
            data={'visit_count': resource_website.visit_count},
            message='访问量已更新'
        )

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """获取推荐的资源网站"""
        queryset = self.get_queryset().filter(is_featured=True, status=1)[:10]
        serializer = self.get_serializer(queryset, many=True)
        return success_response(data=serializer.data, message='获取推荐资源成功')

    @action(detail=False, methods=['get'])
    def hot(self, request):
        """获取热门资源网站（按访问次数排序）"""
        queryset = self.get_queryset().filter(
            status=1).order_by('-visit_count')[:10]
        serializer = self.get_serializer(queryset, many=True)
        return success_response(data=serializer.data, message='获取热门资源成功')
