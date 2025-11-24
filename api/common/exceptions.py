"""
统一异常处理
"""
from rest_framework.views import exception_handler
from rest_framework import status
from django.http import Http404
from django.core.exceptions import PermissionDenied, ValidationError as DjangoValidationError
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    自定义异常处理器

    将所有异常转换为统一格式:
    {
        "success": false,
        "message": "错误信息",
        "data": null
    }
    """
    # 调用DRF默认的异常处理器
    response = exception_handler(exc, context)

    # 如果DRF处理了异常
    if response is not None:
        error_message = ''

        # 处理不同类型的错误信息
        if isinstance(response.data, dict):
            # 处理字段验证错误
            if 'detail' in response.data:
                error_message = response.data['detail']
            else:
                # 提取第一个错误信息
                for field, messages in response.data.items():
                    if isinstance(messages, list):
                        error_message = f"{field}: {messages[0]}"
                    else:
                        error_message = f"{field}: {messages}"
                    break
        elif isinstance(response.data, list):
            error_message = response.data[0] if response.data else '请求失败'
        else:
            error_message = str(response.data)

        # 统一响应格式
        response.data = {
            'success': False,
            'message': error_message,
            'data': None
        }

        return response

    # 处理Django原生异常
    if isinstance(exc, Http404):
        return_data = {
            'success': False,
            'message': '资源不存在',
            'data': None
        }
        return_response = exception_handler(exc, context)
        if return_response:
            return_response.data = return_data
            return return_response

    if isinstance(exc, PermissionDenied):
        return_data = {
            'success': False,
            'message': '权限不足',
            'data': None
        }
        return_response = exception_handler(exc, context)
        if return_response:
            return_response.data = return_data
            return return_response

    if isinstance(exc, DjangoValidationError):
        return_data = {
            'success': False,
            'message': str(exc),
            'data': None
        }
        from rest_framework.response import Response
        return Response(return_data, status=status.HTTP_400_BAD_REQUEST)

    # 处理未捕获的异常
    logger.error(f'未处理的异常: {exc}', exc_info=True)

    return_data = {
        'success': False,
        'message': '服务器内部错误',
        'data': None
    }

    from rest_framework.response import Response
    return Response(return_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
