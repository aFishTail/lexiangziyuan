"""
自定义分页器
"""
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPageNumberPagination(PageNumberPagination):
    """
    自定义分页器，返回统一格式
    """
    page_size = 20
    page_size_query_param = 'page_size'
    page_query_param = 'page'
    max_page_size = 100

    def get_paginated_response(self, data):
        """
        返回格式:
        {
            "success": true,
            "message": "success",
            "data": {
                "results": [...],
                "count": 100,
                "next": "url",
                "previous": "url",
                "page": 1,
                "page_size": 20,
                "total_pages": 5
            }
        }
        """
        return Response({
            'success': True,
            'message': 'success',
            'data': {
                'results': data,
                'count': self.page.paginator.count,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'page': self.page.number,
                'page_size': self.page_size,
                'total_pages': self.page.paginator.num_pages
            }
        })
