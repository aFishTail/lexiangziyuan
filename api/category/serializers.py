from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    article_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_article_count(self, obj):
        """返回该分类下的文章数量（仅已发布）"""
        return obj.get_article_count()
