from django.urls import path
from .views import SearchArticlesView, TrendingKeywordsView

app_name = 'search'

urlpatterns = [
    path('articles/', SearchArticlesView.as_view(), name='search-articles'),
    path('trending/', TrendingKeywordsView.as_view(), name='trending-keywords'),
]
