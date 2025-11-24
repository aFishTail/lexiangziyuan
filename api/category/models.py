from django.db import models

from common.model.baseModel import BaseModel


# Create your models here.
class Category(BaseModel):
    name = models.CharField("类型名称", max_length=100, unique=True)
    description = models.TextField("类型描述", blank=True)
    order = models.IntegerField("排序顺序", default=0)

    class Meta:
        verbose_name = "资源类型"
        verbose_name_plural = "资源类型"
        ordering = ['order', 'id']  # 首先按order排序，然后按id排序
        indexes = [
            models.Index(fields=['name'], name='type_name_idx'),
            models.Index(fields=['order'], name='type_order_idx'),
        ]

    def __str__(self):
        return self.name

    def get_published_articles(self):
        """获取该分类下的已发布文章"""
        return self.articles.filter(status=1).order_by('-created_time')

    def get_article_count(self):
        """获取该分类下的已发布文章数量"""
        return self.articles.filter(status=1).count()
