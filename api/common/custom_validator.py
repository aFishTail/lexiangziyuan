from functools import wraps

from common.common_response import CommonJsonResponse


def custom_validate_params(required_params):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(viewset, *args, **kwargs):
            for param in required_params:
                if param not in viewset.request.data:  # 或 request.POST
                    return CommonJsonResponse.error(f'Missing parameter: {param}', httpCode=400)
            return view_func(viewset.request, *args, **kwargs)
        return _wrapped_view
    return decorator