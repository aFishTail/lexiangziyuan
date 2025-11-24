from rest_framework import serializers
import os
from django.core.files.base import ContentFile
import requests
from urllib.parse import urlparse

from category.serializers import CategorySerializer
from tag.serializers import TagSerializer
from category.models import Category
from tag.models import Tag
from .models import Article
from .services import ImageService


class ArticleSerializer(serializers.ModelSerializer):
    # tags = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    category = CategorySerializer()

    class Meta:
        model = Article
        fields = ['id', 'name', 'content', 'category', 'tags',
                  'created_time', 'update_time', 'cover_img', 'view_count']


class ArticleCreateSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(write_only=True, required=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )
    cover_img = serializers.URLField(
        required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Article
        fields = ['name', 'content', 'category_name',
                  'tag_names', 'source', 'remark', 'cover_img']

    def create(self, validated_data):
        # 移除不直接属于Article模型的字段
        category_name = validated_data.pop('category_name')
        tag_names = validated_data.pop('tag_names', [])
        cover_img_url = validated_data.pop('cover_img', None)

        # 获取类别
        try:
            category = Category.objects.get(name=category_name)
        except Category.DoesNotExist:
            raise serializers.ValidationError(f"类型 '{category_name}' 不存在")

        # 创建文章基础对象
        article = Article.objects.create(
            category=category,
            status=0,  # 待审核/待发布状态
            **validated_data
        )

        # 添加标签
        for tag_name in tag_names:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            article.tags.add(tag)

        return article
