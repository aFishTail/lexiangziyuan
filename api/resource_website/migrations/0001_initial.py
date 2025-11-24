# Generated manually for resource_website app

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    operations = [
        migrations.CreateModel(
            name='ResourceCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('created_time', models.DateTimeField(
                    auto_now_add=True, verbose_name='创建时间')),
                ('update_time', models.DateTimeField(
                    auto_now=True, verbose_name='更新时间')),
                ('name', models.CharField(max_length=100,
                 unique=True, verbose_name='分类名称')),
                ('description', models.TextField(blank=True, verbose_name='分类描述')),
                ('order', models.IntegerField(default=0, verbose_name='排序顺序')),
                ('icon', models.CharField(blank=True,
                 max_length=100, verbose_name='图标')),
            ],
            options={
                'verbose_name': '资源网站分类',
                'verbose_name_plural': '资源网站分类',
                'ordering': ['order', 'id'],
                'indexes': [
                    models.Index(fields=['name'],
                                 name='resource_cat_name_idx'),
                    models.Index(fields=['order'],
                                 name='resource_cat_order_idx'),
                ],
            },
        ),
        migrations.CreateModel(
            name='ResourceWebsite',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('created_time', models.DateTimeField(
                    auto_now_add=True, verbose_name='创建时间')),
                ('update_time', models.DateTimeField(
                    auto_now=True, verbose_name='更新时间')),
                ('name', models.CharField(max_length=200, verbose_name='网站名称')),
                ('url', models.URLField(max_length=500, verbose_name='网站地址')),
                ('logo', models.ImageField(blank=True, null=True,
                 upload_to='resource_logos', verbose_name='网站图标')),
                ('description', models.TextField(blank=True, verbose_name='网站描述')),
                ('tags', models.CharField(blank=True,
                 help_text='多个标签用逗号分隔', max_length=200, verbose_name='标签')),
                ('visit_count', models.IntegerField(
                    default=0, verbose_name='访问次数')),
                ('is_featured', models.BooleanField(
                    default=False, verbose_name='是否推荐')),
                ('status', models.IntegerField(choices=[
                 (0, '待审核'), (1, '已发布'), (2, '已禁用')], default=0, verbose_name='状态')),
                ('remark', models.TextField(blank=True, verbose_name='备注')),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL,
                 related_name='websites', to='resource_website.resourcecategory', verbose_name='分类')),
            ],
            options={
                'verbose_name': '资源网站',
                'verbose_name_plural': '资源网站',
                'ordering': ['-is_featured', '-visit_count', '-update_time'],
                'indexes': [
                    models.Index(fields=['name'],
                                 name='resource_web_name_idx'),
                    models.Index(fields=['status'],
                                 name='resource_web_status_idx'),
                ],
            },
        ),
    ]
