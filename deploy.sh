#!/bin/bash

# Lenjoy Manager - 一键部署脚本
# 适用于 Linux 和 macOS

set -e

echo "🚀 Lenjoy Manager - Docker 一键部署"
echo "===================================="

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未安装 Docker"
    echo "请访问 https://docs.docker.com/get-docker/ 安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否可用
if ! docker compose version &> /dev/null; then
    echo "❌ 错误: Docker Compose 不可用"
    echo "请确保安装了 Docker Compose V2"
    exit 1
fi

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件，从 .env.example 创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件"
    echo ""
    echo "⚠️  重要提示:"
    echo "   请编辑 .env 文件，修改以下配置："
    echo "   - SECRET_KEY (必须修改)"
    echo "   - DATABASE_PASSWORD (建议修改)"
    echo "   - DATABASE_ROOT_PASSWORD (建议修改)"
    echo ""
    read -p "按回车键继续，或按 Ctrl+C 取消并编辑 .env 文件..."
fi

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p logs/nginx logs/mysql api/media api/staticfiles letsencrypt

# 停止并删除旧容器
echo "🧹 清理旧容器..."
docker compose down -v 2>/dev/null || true

# 构建并启动服务
echo "🏗️  构建 Docker 镜像..."
if ! docker compose build --no-cache; then
    echo ""
    echo "❌ Docker 构建失败！"
    echo "请检查上面的错误信息并修复问题。"
    exit 1
fi

echo "🚢 启动服务..."
if ! docker compose up -d; then
    echo ""
    echo "❌ 服务启动失败！"
    echo "请检查上面的错误信息。"
    exit 1
fi

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
echo ""
echo "📊 服务状态:"
docker compose ps

# 显示日志提示
echo ""
echo "✅ 部署完成！"
echo ""
echo "📝 访问地址:"
echo "   - 前端: http://localhost"
echo "   - 后端 API: http://localhost/api"
echo "   - 后端管理: http://localhost/admin"
echo "   - API 文档: http://localhost/swagger"
echo ""
echo "📋 常用命令:"
echo "   - 查看日志: docker compose logs -f"
echo "   - 停止服务: docker compose down"
echo "   - 重启服务: docker compose restart"
echo "   - 查看状态: docker compose ps"
echo ""
echo "💡 提示: 首次启动可能需要几分钟时间初始化数据库"
echo "   可以使用 'docker compose logs -f api' 查看后端启动日志"
