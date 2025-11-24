# 1. 备份数据库（MySQL）
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. 拉取代码
git pull

# 3. 运行迁移
python manage.py migrate

# 完成！