from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.ResourceCategoryViewSet,
                basename='resource-category')
router.register(r'websites', views.ResourceWebsiteViewSet,
                basename='resource-website')

urlpatterns = [
    path('', include(router.urls)),
]
