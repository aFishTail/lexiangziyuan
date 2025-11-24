from django_filters import rest_framework as filters

from article.models import Article


class ArticleFilter(filters.FilterSet):
    """文章过滤器"""

    min_publish = filters.DateTimeFilter(field_name="publish_time",
                                         lookup_expr='gte')
    max_publish = filters.DateTimeFilter(field_name="publish_time",
                                         lookup_expr='lte')

    category_id = filters.NumberFilter(
        field_name='category__id', lookup_expr='exact')

    # 按名称模糊搜索
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = Article
        fields = ['category_id', 'name']
