"""
统一API响应格式封装
"""
from rest_framework.response import Response
from rest_framework import status


class APIResponse(Response):
    """
    自定义统一响应格式

    返回格式:
    {
        "success": true/false,
        "message": "提示信息",
        "data": {} 或 null
    }
    """

    def __init__(self, data=None, message='success', success=True,
                 status_code=status.HTTP_200_OK, **kwargs):
        """
        初始化响应

        Args:
            data: 响应数据
            message: 提示信息
            success: 操作是否成功
            status_code: HTTP状态码
        """
        response_data = {
            'success': success,
            'message': message,
            'data': data
        }

        super().__init__(data=response_data, status=status_code, **kwargs)


def success_response(data=None, message='操作成功', status_code=status.HTTP_200_OK):
    """成功响应的快捷方法"""
    return APIResponse(
        data=data,
        message=message,
        success=True,
        status_code=status_code
    )


def error_response(message='操作失败', data=None, status_code=status.HTTP_400_BAD_REQUEST):
    """失败响应的快捷方法"""
    return APIResponse(
        data=data,
        message=message,
        success=False,
        status_code=status_code
    )
