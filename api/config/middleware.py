import time
import json
import logging
from django.http import JsonResponse
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from django.core.exceptions import PermissionDenied
from rest_framework.exceptions import APIException

logger = logging.getLogger('request')

class RequestLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # 记录请求开始时间
        request.start_time = time.time()
        
        # 获取请求信息
        request_info = {
            'method': request.method,
            'path': request.path,
            'query_params': dict(request.GET),
            'headers': dict(request.headers),
        }
        
        # 如果是POST/PUT/PATCH请求，记录请求体
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                if request.content_type == 'application/json':
                    request_info['body'] = json.loads(request.body)
                else:
                    request_info['body'] = dict(request.POST)
            except Exception as e:
                request_info['body'] = f'无法解析请求体: {str(e)}'
        
        # 记录请求信息
        logger.info(f'请求开始: {json.dumps(request_info, ensure_ascii=False)}')
        
        return None

    def process_response(self, request, response):
        # 计算请求处理时间
        duration = time.time() - request.start_time
        
        # 准备响应信息
        response_info = {
            'status_code': response.status_code,
            'duration': f'{duration:.3f}s',
        }
        
        # 如果是API响应，记录响应数据
        if isinstance(response, JsonResponse):
            try:
                response_info['data'] = json.loads(response.content)
            except:
                response_info['data'] = '无法解析响应数据'
        
        # 记录响应信息
        logger.info(f'请求完成: {json.dumps(response_info, ensure_ascii=False)}')
        
        return response

    def process_exception(self, request, exception):
        # 计算请求处理时间
        duration = time.time() - request.start_time
        
        # 准备错误信息
        error_info = {
            'error_type': exception.__class__.__name__,
            'error_message': str(exception),
            'duration': f'{duration:.3f}s',
        }
        
        # 如果是API异常，记录更多信息
        if isinstance(exception, APIException):
            error_info.update({
                'status_code': exception.status_code,
                'detail': exception.detail,
            })
        
        # 记录错误信息
        logger.error(f'请求异常: {json.dumps(error_info, ensure_ascii=False)}', exc_info=True)
        
        return None 