from django.db import models

from common.model.baseModel import BaseModel


class Tag(BaseModel):
    name = models.CharField("标签名称", max_length=50, unique=True)
    synonyms = models.JSONField("同义词",
                                default=list,
                                blank=True,
                                help_text="JSON格式的标签同义词列表")

    class Meta:
        verbose_name = "资源标签"
        verbose_name_plural = "资源标签"
        ordering = ['-created_time']

    def __str__(self):
        return self.name

    def get_related_tags(self):
        """获取关联标签（包含父标签和同义词）"""
        return Tag.objects.filter(
            models.Q(synonyms__contains=[self.name])).distinct()
