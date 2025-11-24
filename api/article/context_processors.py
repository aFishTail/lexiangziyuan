from .models import Article

def article_sidebar(request):
    """
    向所有模板提供热门文章和随机推荐文章数据
    """
    return {
        'hot_articles': Article.objects.hot_articles(),
        'random_articles': Article.objects.random_articles()
    } 