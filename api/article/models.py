from ckeditor_uploader.fields import RichTextUploadingField
from django.db import models
import random

from category.models import Category
from common.model.baseModel import BaseModel
from tag.models import Tag
from ckeditor.fields import RichTextField


class ArticleManager(models.Manager):

    def published(self):
        """
        返回已发布的文章
        """
        return self.filter(status=1)

    def hot_articles(self, limit=10):
        """
        获取热门文章，按照浏览量排序

        Args:
            limit: 返回的文章数量，默认为10

        Returns:
            热门文章的查询集
        """
        return self.published().prefetch_related('tags').select_related('category').order_by('-view_count')[:limit]

    def random_articles(self, limit=10):
        """
        获取随机推荐文章

        Args:
            limit: 返回的文章数量，默认为10

        Returns:
            随机文章的查询集
        """
        article_count = self.published().count()
        random_count = min(limit, article_count)  # 确保不超过实际文章数量

        if random_count > 0:
            # 获取随机的文章
            random_ids = self.published().values_list('id', flat=True)
            random_ids = list(random_ids)

            if len(random_ids) > random_count:
                random_ids = random.sample(random_ids, random_count)

            return self.prefetch_related('tags').select_related('category').filter(id__in=random_ids)

        return self.none()


class Article(BaseModel):
    STATUS_CHOICE = [
        (0, '待审核'),
        (1, '已发布'),
        (3, '已下架'),
    ]

    name = models.CharField('名称', max_length=200)
    cover_img = models.ImageField(
        '封面', max_length=200, null=True, blank=True, upload_to='article')
    content = RichTextUploadingField('内容')
    view_count = models.IntegerField(default=0)
    category = models.ForeignKey(Category,
                                 on_delete=models.SET_NULL,
                                 null=True,
                                 blank=True,
                                 related_name='articles',
                                 verbose_name="资源类型")
    tags = models.ManyToManyField(Tag,
                                  related_name='articles',
                                  verbose_name="资源标签")
    source = models.CharField('来源', max_length=100, default='网络')
    remark = models.TextField('备注', blank=True)
    is_valid = models.BooleanField('有效', default=True)
    check_time = models.DateTimeField('上次检查状态时间', null=True, blank=True)
    status = models.IntegerField('状态', choices=STATUS_CHOICE, default=0)

    # 使用自定义的管理器
    objects = ArticleManager()

    class Meta:
        indexes = [models.Index(fields=['name'], name='name_idx')]
        ordering = ['-update_time']
        verbose_name = "资源"
        verbose_name_plural = "资源"

    def __str__(self):
        return self.name

    def increment_view_count(self):
        """
        增加文章浏览量
        """
        self.view_count += 1
        self.save(update_fields=['view_count'])
        return self.view_count
