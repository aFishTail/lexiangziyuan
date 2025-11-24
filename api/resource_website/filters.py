import django_filters
from .models import ResourceWebsite, ResourceCategory


class ResourceWebsiteFilter(django_filters.FilterSet):
    """资源网站过滤器"""
    name = django_filters.CharFilter(
        field_name='name', lookup_expr='icontains')
    category_name = django_filters.CharFilter(
        field_name='category__name', lookup_expr='icontains')

    class Meta:
        model = ResourceWebsite
        fields = ['category', 'status', 'is_featured', 'name']
