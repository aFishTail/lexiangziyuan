from .models import Category


def all_categories(request):
    """提供所有分类数据给模板"""
    categories = Category.objects.all().order_by('order', 'id')
    return {
        'all_categories': [
            {
                'id': cat.id,
                'name': cat.name,
                'description': cat.description
            }
            for cat in categories
        ]
    }
