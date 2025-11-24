from django.http import JsonResponse


class CommonJsonResponse:

    @staticmethod
    def success(data=None, message="成功"):
        response = {
            "code": 0,
            "message": message,
            "data": data
        }
        return JsonResponse(response)

    @staticmethod
    def error(data=None, code=1, httpCode=400):
        response = {
            "code": code,
            "message": "失败",
            "data": data
        }
        return JsonResponse(response, status=httpCode)

    class Meta:
        abstract = True