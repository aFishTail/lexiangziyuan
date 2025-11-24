from django.db import models


from django.utils import timezone

class SoftDeleteQuerySet(models.QuerySet):
    def delete(self, *args, **kwargs):
        # 批量更新而不是物理删除
        return self.update(is_deleted=True, deleted_at = timezone.now())

    def restore(self):
        self.update(is_deleted=False, deleted_at = None)

class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        # 使用自定义的 SoftDeleteQuerySet，且默认过滤已删除的数据
        return SoftDeleteQuerySet(self.model, using=self._db)

    def all_not_deleted(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=False)

    def delete(self, *args, **kwargs):
        # 批量更新而不是物理删除
        return self.update(is_deleted=True, deleted_at = timezone.now())

    def update_or_create(self, defaults=None, **kwargs):
        # 检查是否有符合条件且被软删除的对象
        instance = self.filter(**kwargs).first()

        if instance:
            # 如果找到被软删除的记录，恢复并更新
            for key, value in defaults.items():
                setattr(instance, key, value)
            instance.is_deleted = False  # 恢复删除
            instance.updated_at = timezone.now()  # 更新时间戳
            instance.save()
            return instance, True  # 表示更新

        # 如果没有软删除的记录，则执行 get_or_create 逻辑
        instance, created = self.get_or_create(defaults=defaults, **kwargs)
        return instance, created


class BaseModel(models.Model):
    created_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    # is_deleted = models.BooleanField(default=False)
    # deleted_at = models.DateTimeField(null=True, blank=True)
    #
    # objects = SoftDeleteManager()  # 使用自定义管理器
    # all_objects = models.Manager()  # 用于查询包括已删除数据在内的所有记录

    class Meta:
        abstract = True  # 作为抽象基类，不生成数据库表

    # def delete(self, using=None, keep_parents=False):
    #     # 重写 delete 方法为软删除
    #     self.is_deleted = True
    #     self.deleted_at = timezone.now()
    #     self.save()
    #
    # def restore(self):
    #     # 提供恢复功能，取消软删除
    #     self.is_deleted = False
    #     self.deleted_at = None
    #     self.save()