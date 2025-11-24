from django.db import models
from common.model.baseModel import BaseModel


class ResourceCategory(BaseModel):
    """资源网站分类"""

    name = models.CharField("分类名称", max_length=100, unique=True)
    description = models.TextField("分类描述", blank=True)
    order = models.IntegerField("排序顺序", default=0)
    icon = models.CharField("图标", max_length=100, blank=True)

    class Meta:
        verbose_name = "资源网站分类"
        verbose_name_plural = "资源网站分类"
        ordering = ['order', 'id']
        indexes = [
            models.Index(fields=['name'], name='resource_cat_name_idx'),
            models.Index(fields=['order'], name='resource_cat_order_idx'),
        ]

    def __str__(self):
        return self.name


class ResourceWebsite(BaseModel):
    """资源网站"""

    STATUS_CHOICE = [
        (0, '待审核'),
        (1, '已发布'),
        (2, '已禁用'),
    ]

    name = models.CharField('网站名称', max_length=200)
    url = models.URLField('网站地址', max_length=500)
    logo = models.ImageField(
        '网站图标', upload_to='resource_logos', null=True, blank=True)
    description = models.TextField('网站描述', blank=True)
    category = models.ForeignKey(
        ResourceCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resource_websites',
        verbose_name="分类"
    )
    visit_count = models.IntegerField('访问次数', default=0)
    is_featured = models.BooleanField('是否推荐', default=False)
    status = models.IntegerField('状态', choices=STATUS_CHOICE, default=1)
    remark = models.TextField('备注', blank=True)

    class Meta:
        verbose_name = "资源网站"
        verbose_name_plural = "资源网站"
        ordering = ['-is_featured', '-visit_count', '-update_time']
        indexes = [
            models.Index(fields=['name'], name='resource_web_name_idx'),
            models.Index(fields=['status'], name='resource_web_status_idx'),
        ]

    def __str__(self):
        return self.name

    def increment_visit_count(self):
        """增加访问次数"""
        self.visit_count += 1
        self.save(update_fields=['visit_count'])
        return self.visit_count
