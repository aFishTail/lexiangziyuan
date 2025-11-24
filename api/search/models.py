from django.db import models
from common.model.baseModel import BaseModel


class SearchKeyword(BaseModel):
    """搜索关键词模型 - 记录用户搜索历史和热门搜索"""

    keyword = models.CharField(
        '搜索关键词', max_length=200, unique=True, db_index=True)
    count = models.IntegerField('搜索次数', default=1)
    last_searched = models.DateTimeField('最后搜索时间', auto_now=True)

    class Meta:
        verbose_name = '搜索关键词'
        verbose_name_plural = '搜索关键词'
        ordering = ['-count', '-last_searched']
        indexes = [
            models.Index(fields=['-count', '-last_searched'],
                         name='search_trending_idx'),
        ]

    def __str__(self):
        return f"{self.keyword} ({self.count}次)"

    def increment_count(self):
        """增加搜索次数"""
        self.count += 1
        self.save(update_fields=['count', 'last_searched'])
        return self.count

    @classmethod
    def record_search(cls, keyword: str) -> 'SearchKeyword':
        """记录搜索关键词，存在则增加计数，不存在则创建"""
        if not keyword or not keyword.strip():
            return None

        keyword = keyword.strip()[:200]  # 限制长度

        obj, created = cls.objects.get_or_create(
            keyword=keyword,
            defaults={'count': 1}
        )

        if not created:
            obj.increment_count()

        return obj

    @classmethod
    def get_trending(cls, limit: int = 10):
        """获取热门搜索词"""
        return cls.objects.all()[:limit]
