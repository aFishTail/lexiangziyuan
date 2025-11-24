"""
自定义渲染器
"""
from rest_framework.renderers import JSONRenderer


class CustomJSONRenderer(JSONRenderer):
    """
    自定义JSON渲染器
    为没有手动包装的响应自动添加统一格式
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        """
        自动包装未统一格式的响应
        """
        # 如果响应已经是统一格式（包含success字段），直接返回
        if data is not None and isinstance(data, dict) and 'success' in data:
            return super().render(data, accepted_media_type, renderer_context)

        # 获取响应对象
        response = renderer_context.get(
            'response') if renderer_context else None

        # 对于成功的响应（状态码 < 400），自动包装为统一格式
        if response and response.status_code < 400:
            wrapped_data = {
                'success': True,
                'message': 'success',
                'data': data
            }
            return super().render(wrapped_data, accepted_media_type, renderer_context)

        # 其他情况直接返回（错误响应由 custom_exception_handler 处理）
        return super().render(data, accepted_media_type, renderer_context)
