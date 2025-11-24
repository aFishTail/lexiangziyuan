from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from common.response import success_response, error_response
from .filters import ArticleFilter
from .models import Article
from .serializers import ArticleSerializer, ArticleCreateSerializer
from .services import ImageService


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    文章视图集（只读）

    list: 获取文章列表（支持分页、过滤和排序）
    retrieve: 获取文章详情
    hot: 获取热门文章
    random: 获取随机推荐文章
    today: 获取今天新增的文章
    create_with_images: 创建文章（支持图片处理，需要认证）

    排序参数:
    - order=created_time: 按创建时间正序
    - order=-created_time: 按创建时间倒序
    - order=view_count: 按浏览量正序
    - order=-view_count: 按浏览量倒序
    - order=update_time: 按更新时间正序
    - order=-update_time: 按更新时间倒序
    """
    queryset = Article.objects.prefetch_related(
        'tags').select_related('category')
    serializer_class = ArticleSerializer
    filterset_class = ArticleFilter
    search_fields = ['name', 'remark', 'content']
    ordering_fields = ['created_time',
                       'update_time', 'view_count', 'id']  # 允许排序的字段
    ordering = ['-created_time']  # 默认排序

    def get_queryset(self):
        """默认只返回已发布的文章"""
        queryset = super().get_queryset()
        # 非管理员只能看到已发布的文章
        if not self.request.user.is_staff:
            queryset = queryset.filter(status=1)
        return queryset

    def retrieve(self, request, *args, **kwargs):
        """获取详情（不自动增加浏览量，需要前端主动调用 increment_view）"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return success_response(data=serializer.data, message='获取成功')

    @action(detail=True, methods=['post'], url_path='increment_view')
    def increment_view(self, request, pk=None):
        """增加文章浏览量"""
        article = self.get_object()
        article.increment_view_count()
        return success_response(
            data={'view_count': article.view_count},
            message='浏览量已更新'
        )

    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        """获取相关文章推荐"""
        current_article = self.get_object()
        limit = int(request.query_params.get('limit', 6))

        # 获取相关文章的查询集
        related_articles = []

        # 1. 优先推荐同分类的文章
        if current_article.category:
            same_category = self.get_queryset().filter(
                category=current_article.category
            ).exclude(id=current_article.id)[:limit]
            related_articles.extend(same_category)

        # 2. 如果同分类文章不够，添加有共同标签的文章
        if len(related_articles) < limit:
            current_tags = current_article.tags.all()
            if current_tags:
                same_tags = self.get_queryset().filter(
                    tags__in=current_tags
                ).exclude(id=current_article.id).distinct()[:limit * 2]

                # 去重并添加
                for article in same_tags:
                    if article not in related_articles and len(related_articles) < limit:
                        related_articles.append(article)

        # 3. 如果还不够，随机补充其他文章
        if len(related_articles) < limit:
            remaining = limit - len(related_articles)
            existing_ids = [a.id for a in related_articles] + \
                [current_article.id]
            other_articles = self.get_queryset().exclude(
                id__in=existing_ids
            ).order_by('-view_count')[:remaining]
            related_articles.extend(other_articles)

        serializer = self.get_serializer(related_articles[:limit], many=True)
        return success_response(data=serializer.data, message='获取相关文章成功')

    @action(detail=False, methods=['get'])
    def hot(self, request):
        """获取热门文章（按浏览量排序）"""
        limit = int(request.query_params.get('limit', 10))
        queryset = self.get_queryset().order_by('-view_count')[:limit]
        serializer = self.get_serializer(queryset, many=True)
        return success_response(data=serializer.data, message='获取热门文章成功')

    @action(detail=False, methods=['get'])
    def random(self, request):
        """获取随机推荐文章"""
        import random as rand
        limit = int(request.query_params.get('limit', 10))

        # 获取基础查询集
        base_queryset = self.get_queryset()
        article_count = base_queryset.count()
        random_count = min(limit, article_count)

        if random_count > 0:
            # 获取随机ID
            random_ids = list(base_queryset.values_list('id', flat=True))
            if len(random_ids) > random_count:
                random_ids = rand.sample(random_ids, random_count)

            queryset = base_queryset.filter(id__in=random_ids)
        else:
            queryset = base_queryset.none()

        serializer = self.get_serializer(queryset, many=True)
        return success_response(data=serializer.data, message='获取推荐文章成功')

    @action(detail=False, methods=['get'])
    def today(self, request):
        """获取今天新增的所有文章"""
        from django.utils import timezone
        from datetime import timedelta

        today = timezone.now().date()
        tomorrow = today + timedelta(days=1)

        articles = Article.objects.filter(
            created_time__gte=today,
            created_time__lt=tomorrow
        ).order_by('-created_time')

        serializer = self.get_serializer(articles, many=True)
        return success_response(data=serializer.data, message='获取今日文章成功')

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated],
            authentication_classes=[JWTAuthentication], url_path='create')
    def create_article(self, request):
        """
        创建文章（支持图片处理）

        使用示例:
        POST /api/articles/create/
        {
            "name": "文章标题",
            "content": "文章内容...",
            "category_name": "分类名称",
            "tag_names": ["标签1", "标签2"],
            "source": "来源网站",
            "remark": "备注信息",
            "domain": "https://example.com"  # 如果content中的图片使用相对路径，需要指定域名
        }

        特别说明:
        1. 内容中的图片会被自动下载到 media/api-uploads 目录
        2. 支持处理content中的<img>标签，将远程图片下载到本地并替换src属性
        3. 支持处理base64编码的图片数据
        4. 所有图片会使用唯一文件名保存，避免冲突
        5. 如果图片使用相对路径，需要提供domain参数，用于构建完整URL
        6. 需要提供有效的JWT令牌才能访问此接口
        """
        try:
            # 获取domain参数
            name = request.data.get('name')
            domain = request.data.get('domain')

            if name and domain:
                # 检查是否已存在相同标题和来源的文章
                existing_article = Article.objects.filter(
                    name=name, source=domain).first()
                if existing_article:
                    return error_response(
                        message=f'已存在相同标题和来源的文章 (ID: {existing_article.id})',
                        status_code=status.HTTP_400_BAD_REQUEST
                    )

            # 获取并预处理请求数据
            request_data = request.data.copy()

            # 处理content中的图片，将远程图片下载到本地并替换src属性
            if 'content' in request_data:
                request_data['content'] = ImageService.process_content_images(
                    request_data['content'], domain=domain)

            # 处理封面图
            cover_img_url = request_data.get('cover_img')
            cover_img_result = ImageService.process_cover_image(
                cover_img_url,
                content=request_data.get('content'),
                domain=domain)

            # 移除domain字段，因为Article模型中没有该字段
            if 'domain' in request_data:
                request_data.update({'source': domain})
                request_data.pop('domain')

            # 先移除cover_img字段，我们将在后面处理
            if 'cover_img' in request_data:
                request_data.pop('cover_img')

            # 验证和创建文章
            serializer = ArticleCreateSerializer(data=request_data)
            if serializer.is_valid():
                # 保存文章基本信息
                article = serializer.save()

                # 如果有封面图，设置封面图
                if cover_img_result:
                    if isinstance(cover_img_result, tuple):
                        # 如果是元组(filename, content)，使用save方法
                        filename, img_content = cover_img_result
                        article.cover_img.save(filename,
                                               img_content,
                                               save=True)
                    else:
                        # 如果是字符串路径，直接设置
                        article.cover_img = cover_img_result
                        article.save()

                return success_response(
                    data={'id': article.id},
                    message='文章创建成功，待发布',
                    status_code=status.HTTP_201_CREATED
                )
            else:
                # 返回验证错误
                error_messages = []
                for field, errors in serializer.errors.items():
                    error_messages.append(f"{field}: {', '.join(errors)}")
                return error_response(
                    message='; '.join(error_messages),
                    status_code=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return error_response(
                message=f'处理请求时出错: {str(e)}',
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
