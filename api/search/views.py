from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from common.response import success_response, error_response
from common.pagination import CustomPageNumberPagination
from article.models import Article
from article.serializers import ArticleSerializer
from .models import SearchKeyword
from .serializers import TrendingKeywordSerializer


class SearchArticlesView(APIView):
    """
    搜索文章接口

    GET /api/search/articles/?q=关键词&page=1&page_size=12
    """
    permission_classes = [AllowAny]
    pagination_class = CustomPageNumberPagination

    @swagger_auto_schema(
        operation_summary='搜索文章',
        operation_description='搜索文章标题、内容和备注，只返回已发布的文章',
        manual_parameters=[
            openapi.Parameter(
                'q',
                openapi.IN_QUERY,
                description='搜索关键词（必填）',
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'page',
                openapi.IN_QUERY,
                description='页码，默认1',
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'page_size',
                openapi.IN_QUERY,
                description='每页数量，默认20，最大100',
                type=openapi.TYPE_INTEGER,
                required=False
            ),
        ],
        responses={
            200: openapi.Response(
                description='搜索成功',
                examples={
                    'application/json': {
                        'success': True,
                        'message': 'success',
                        'data': {
                            'results': [],
                            'count': 100,
                            'next': 'http://example.com/api/search/articles/?page=2',
                            'previous': None,
                            'page': 1,
                            'page_size': 20,
                            'total_pages': 5
                        }
                    }
                }
            ),
            400: '请求参数错误'
        }
    )
    def get(self, request):
        # 获取搜索关键词
        query = request.query_params.get('q', '').strip()

        if not query:
            return error_response(message='请输入搜索关键词', status_code=400)

        # 记录搜索关键词
        SearchKeyword.record_search(query)

        # 搜索文章（只搜索已发布的文章）
        articles = Article.objects.filter(
            Q(name__icontains=query),
            status=1  # 只搜索已发布的文章
        ).select_related('category').prefetch_related('tags').distinct()

        # 分页
        paginator = self.pagination_class()
        paginated_articles = paginator.paginate_queryset(articles, request)

        # 序列化
        serializer = ArticleSerializer(paginated_articles, many=True)

        # 使用分页器的标准响应格式（与 ViewSet 保持一致）
        return paginator.get_paginated_response(serializer.data)


class TrendingKeywordsView(APIView):
    """
    热门搜索词接口

    GET /api/search/trending/?limit=10
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary='获取热门搜索词',
        operation_description='返回搜索次数最多的关键词列表',
        manual_parameters=[
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description='返回数量，默认10，最大50',
                type=openapi.TYPE_INTEGER,
                required=False
            ),
        ],
        responses={
            200: openapi.Response(
                description='获取成功',
                examples={
                    'application/json': {
                        'code': 200,
                        'message': '获取热门搜索词成功',
                        'data': [
                            {'keyword': 'Python', 'count': 156},
                            {'keyword': 'Django', 'count': 89}
                        ]
                    }
                }
            )
        }
    )
    def get(self, request):
        # 获取限制数量
        limit = int(request.query_params.get('limit', 10))
        limit = min(max(1, limit), 50)  # 限制在 1-50 之间

        # 获取热门搜索词
        trending = SearchKeyword.get_trending(limit=limit)

        # 序列化
        serializer = TrendingKeywordSerializer(trending, many=True)

        return success_response(
            data=serializer.data,
            message='获取热门搜索词成功'
        )
