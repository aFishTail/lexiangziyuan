from rest_framework import serializers
from .models import ResourceCategory, ResourceWebsite


class ResourceCategorySerializer(serializers.ModelSerializer):
    """资源网站分类序列化器"""
    resource_website_count = serializers.SerializerMethodField()

    class Meta:
        model = ResourceCategory
        fields = ['id', 'name', 'description', 'order',
                  'icon', 'resource_website_count', 'created_time', 'update_time']
        read_only_fields = ['created_time', 'update_time']

    def get_resource_website_count(self, obj):
        """返回该分类下的资源数量（仅已发布）"""
        return obj.resource_websites.filter(status=1).count()


class ResourceWebsiteSerializer(serializers.ModelSerializer):
    """资源网站序列化器（列表展示）"""

    category = ResourceCategorySerializer(read_only=True)

    class Meta:
        model = ResourceWebsite
        fields = [
            'id', 'name', 'url', 'logo', 'description',
            'category', 'visit_count',
            'is_featured', 'status', 'created_time', 'update_time'
        ]
        read_only_fields = ['visit_count', 'created_time', 'update_time']


class ResourceWebsiteDetailSerializer(serializers.ModelSerializer):
    """资源网站详情序列化器"""

    category = ResourceCategorySerializer(read_only=True)

    class Meta:
        model = ResourceWebsite
        fields = '__all__'
        read_only_fields = ['visit_count', 'created_time', 'update_time']
