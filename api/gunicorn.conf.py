# Gunicorn 配置文件
import multiprocessing

# 服务器绑定
bind = '0.0.0.0:8000'

# 超时时间
timeout = 60

# Worker 配置
worker_class = 'gevent'  # 使用 gevent 异步模式，需要安装 gevent
workers = multiprocessing.cpu_count() * 2 + 1  # 根据 CPU 核心数自动计算
threads = 2  # 每个 worker 的线程数

# 日志配置
loglevel = 'info'
access_log_format = '%(t)s %(p)s %(h)s "%(r)s" %(s)s %(L)s %(b)s %(f)s" "%(a)s"'
accesslog = "/app/logs/gunicorn_access.log"
errorlog = "/app/logs/gunicorn_error.log"

# 进程命名
proc_name = 'lenjoy-api'

# 在 worker 启动后加载应用（节省内存）
preload_app = False
