from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from article.models import Article
from resource_website.models import ResourceWebsite
from category.models import Category
from resource_website.models import ResourceCategory
from tag.models import Tag
from common.response import success_response


# Create your views here.
def about(request):
    update_logs = [{
        "date": "2025-04-10",
        "title": "第一个版本发布",
        "content": "我们发布了第一版本，感谢大家的支持！",
        "badge": "版本发布"
    }]
    return render(request, 'setting/about.html', {'update_logs': update_logs})


class StatisticsView(APIView):
    """网站统计信息 API"""
    permission_classes = [AllowAny]

    def get(self, request):
        """获取网站统计数据"""
        stats = {
            'article_count': Article.objects.filter(status=1).count(),
            'resource_count': ResourceWebsite.objects.filter(status=1).count(),
            'category_count': Category.objects.count(),
            'resource_category_count': ResourceCategory.objects.count(),
            'tag_count': Tag.objects.count(),
        }
        return success_response(data=stats, message='获取统计信息成功')
