import os
import re
import uuid
import requests
from urllib.parse import urlparse
from django.conf import settings
import base64
from django.core.files.base import ContentFile
import logging
import time

# 设置日志
logger = logging.getLogger(__name__)

class ImageService:
    """处理图片相关的服务类"""

    # 常用浏览器User-Agent列表，轮换使用避免被识别为爬虫
    USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
    ]
    
    @staticmethod
    def get_user_agent():
        """返回随机User-Agent"""
        import random
        return random.choice(ImageService.USER_AGENTS)

    @staticmethod
    @staticmethod
    def download_and_save_image(image_url, referer=None, max_retries=2):
        """
        下载图片并保存到本地，返回新的图片URL
        
        Args:
            image_url: 图片URL
            referer: 引用页面URL，解决防盗链问题
            max_retries: 最大重试次数
        """
        if not image_url:
            return None
            
        try:
            logger.info(f"开始处理图片: {image_url}")
            # 处理base64图片
            if image_url.startswith('data:image'):
                # 解析base64数据
                format, imgstr = image_url.split(';base64,')
                ext = format.split('/')[-1]

                # 创建唯一文件名
                filename = f"{uuid.uuid4()}.{ext}"
                file_path = os.path.join('api-uploads', filename)
                absolute_path = os.path.join(settings.MEDIA_ROOT, file_path)

                # 确保目录存在
                os.makedirs(os.path.dirname(absolute_path), exist_ok=True)

                # 保存文件
                data = base64.b64decode(imgstr)
                with open(absolute_path, 'wb') as f:
                    f.write(data)

                return os.path.join(settings.MEDIA_URL, file_path)

            # 处理URL图片
            else:
                # 如果已经是本地媒体URL，直接返回
                if image_url.startswith(settings.MEDIA_URL):
                    return image_url
                    
                # 解析URL
                parsed_url = urlparse(image_url)
                
                # 检查URL有效性
                if not parsed_url.scheme or not parsed_url.netloc:
                    logger.warning(f"无效的图片URL格式: {image_url}")
                    return None

                # 获取文件名和扩展名
                path = parsed_url.path
                ext = os.path.splitext(path)[1].lower()
                if not ext or ext not in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']:
                    ext = '.jpg'  # 默认扩展名

                # 创建唯一文件名                        
                filename = f"{uuid.uuid4()}{ext}"
                file_path = os.path.join('api-uploads', filename)
                absolute_path = os.path.join(settings.MEDIA_ROOT, file_path)

                # 确保目录存在
                os.makedirs(os.path.dirname(absolute_path), exist_ok=True)
                
                # 设置请求头，模拟浏览器行为
                headers = {
                    'User-Agent': ImageService.get_user_agent(),
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
                
                # 设置引用页，解决防盗链问题
                if referer:
                    headers['Referer'] = referer
                else:
                    # 使用图片所在域名作为referer
                    headers['Referer'] = f"{parsed_url.scheme}://{parsed_url.netloc}/"
                
                retries = 0
                while retries <= max_retries:
                    try:
                        # 下载图片
                        response = requests.get(
                            image_url, 
                            headers=headers, 
                            stream=True, 
                            timeout=15,
                            allow_redirects=True
                        )
                        response.raise_for_status()
                        
                        # 检查响应是否为图片
                        content_type = response.headers.get('Content-Type', '')
                        if not content_type.startswith('image/'):
                            logger.warning(f"响应不是图片: {image_url}, Content-Type: {content_type}")
                            return None
                            
                        # 保存图片
                        with open(absolute_path, 'wb') as f:
                            for chunk in response.iter_content(8192):  # 使用更大的块大小
                                f.write(chunk)
                        
                        # 成功下载
                        return os.path.join(settings.MEDIA_URL, file_path)
                        
                    except requests.exceptions.RequestException as e:
                        logger.warning(f"下载图片失败 (尝试 {retries+1}/{max_retries+1}): {image_url}, 错误: {str(e)}")
                        retries += 1
                        if retries <= max_retries:
                            # 指数退避策略
                            time.sleep(2 ** retries)
                            # 尝试更换User-Agent
                            headers['User-Agent'] = ImageService.get_user_agent()
                        else:
                            logger.error(f"下载图片达到最大重试次数: {image_url}")
                            return None
        
        except Exception as e:
            logger.exception(f"图片处理失败: {image_url}, 错误: {str(e)}")
            return None

    @classmethod
    def extract_first_image_url(cls, content, domain=None):
        """
        从HTML内容中提取第一个图片的URL
        
        Args:
            content: HTML内容
            domain: 内容来源的域名，用于处理相对路径
            
        Returns:
            第一个图片的URL，如果没有图片则返回None
        """
        if not content:
            return None

        # 查找所有img标签的src属性
        img_pattern = r'<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*>'
        match = re.search(img_pattern, content)

        if not match:
            return None

        img_url = match.group(1)

        # 如果已经是本地媒体URL，直接返回
        if img_url.startswith(settings.MEDIA_URL):
            return img_url

        # 处理完整URL (http://, https://, data:image)
        if img_url.startswith(('http://', 'https://', 'data:image')):
            return img_url

        # 处理相对路径的情况
        elif domain:
            # 构建完整URL
            if img_url.startswith('/'):
                # 如果是以/开头的相对路径
                full_url = f"{domain.rstrip('/')}{img_url}"
            else:
                # 如果是不以/开头的相对路径
                full_url = f"{domain.rstrip('/')}/{img_url}"

            return full_url

        # 没有domain又不是完整URL，无法处理
        return None

    @classmethod
    def process_content_images(cls, content, domain=None):
        """
        处理内容中的图片，下载并替换src属性
        
        Args:
            content: 包含图片的HTML内容
            domain: 内容来源的域名，用于处理相对路径的图片
                   例如：'https://example.com'
        """
        if not content:
            return content

        # 查找所有img标签
        img_pattern = r'<img[^>]+src=[\'"]([^\'"]+)[\'"][^>]*>'

        def replace_image(match):
            img_tag = match.group(0)
            img_url = match.group(1)

            # 如果已经是本地媒体URL，不处理
            if img_url.startswith(settings.MEDIA_URL):
                return img_tag

            # 处理完整URL (http://, https://, data:image)
            if img_url.startswith(('http://', 'https://', 'data:image')):
                # 下载图片并获取新URL
                new_url = cls.download_and_save_image(img_url, referer=domain)
                # 如果下载失败，保留原始图片URL
                if not new_url:
                    logger.warning(f"无法下载图片，保留原始URL: {img_url}")
                    return img_tag
                return img_tag.replace(img_url, new_url)

            # 处理相对路径的情况
            elif domain:
                # 构建完整URL
                if img_url.startswith('/'):
                    # 如果是以/开头的相对路径
                    full_url = f"{domain.rstrip('/')}{img_url}"
                else:
                    # 如果是不以/开头的相对路径
                    full_url = f"{domain.rstrip('/')}/{img_url}"

                # 下载图片并获取新URL
                new_url = cls.download_and_save_image(full_url, referer=domain)
                # 如果下载失败，保留原始相对路径
                if not new_url:
                    logger.warning(f"无法下载图片，保留原始相对路径: {img_url}")
                    return img_tag
                return img_tag.replace(img_url, new_url)

            # 没有domain又不是完整URL，保持原样
            return img_tag

        # 替换所有图片
        processed_content = re.sub(img_pattern, replace_image, content)
        return processed_content

    @classmethod
    def process_cover_image(cls, cover_img_url, content=None, domain=None):
        """
        处理封面图片
        
        Args:
            cover_img_url: 指定的封面图URL，可能为None
            content: 文章内容，用于在没有封面图时提取第一个图片
            domain: 内容来源的域名
            
        Returns:
            处理后的封面图对象或路径，可供Django的ImageField使用
        """
        # 如果没有提供封面图，尝试从内容中提取第一个图片
        if not cover_img_url and content:
            cover_img_url = cls.extract_first_image_url(content, domain=domain)

        if not cover_img_url:
            return None

        try:
            # 如果URL是本地media URL，直接提取路径部分
            if cover_img_url.startswith(('/media/', 'media/')):
                return cover_img_url.split('media/')[-1]  # 只保留media/后面的路径部分

            # 处理base64图片
            if cover_img_url.startswith('data:image'):
                # 解析base64数据
                format, imgstr = cover_img_url.split(';base64,')
                ext = format.split('/')[-1]

                # 创建唯一文件名
                filename = f"cover_{uuid.uuid4()}.{ext}"

                # 解码base64并返回文件对象
                data = base64.b64decode(imgstr)
                return filename, ContentFile(data)

            # 设置请求头，模拟浏览器行为
            headers = {
                'User-Agent': cls.get_user_agent(),
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
            }
            
            # 设置引用页，解决防盗链问题
            parsed_url = urlparse(cover_img_url)
            if domain:
                headers['Referer'] = domain
            else:
                headers['Referer'] = f"{parsed_url.scheme}://{parsed_url.netloc}/"

            # 下载URL图片
            response = requests.get(
                cover_img_url, 
                headers=headers,
                stream=True, 
                timeout=15,
                allow_redirects=True
            )
            response.raise_for_status()

            # 检查响应是否为图片
            content_type = response.headers.get('Content-Type', '')
            if not content_type.startswith('image/'):
                logger.warning(f"响应不是图片: {cover_img_url}, Content-Type: {content_type}")
                return None

            # 从URL中提取文件名
            path = urlparse(cover_img_url).path
            filename = os.path.basename(path)

            # 确保文件名唯一并有扩展名
            if '.' not in filename:
                ext = '.jpg'  # 默认扩展名
                if content_type != 'image/jpeg':
                    # 从Content-Type获取扩展名
                    mime_to_ext = {
                        'image/png': '.png',
                        'image/gif': '.gif',
                        'image/webp': '.webp',
                        'image/svg+xml': '.svg'
                    }
                    ext = mime_to_ext.get(content_type, '.jpg')
                filename = f"{filename}{ext}"

            # 添加cover_前缀避免冲突
            filename = f"cover_{uuid.uuid4()}_{filename}"

            # 返回元组(文件名, 文件内容)，这种格式可直接用于ImageField.save()
            return filename, ContentFile(response.content)

        except Exception as e:
            logger.exception(f"处理封面图失败: {cover_img_url}, 错误: {str(e)}")
            return None
