from rest_framework import serializers
from .models import SearchKeyword


class TrendingKeywordSerializer(serializers.ModelSerializer):
    """热门搜索词序列化器"""

    class Meta:
        model = SearchKeyword
        fields = ['keyword', 'count']
