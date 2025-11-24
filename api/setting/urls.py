from django.urls import path
from setting.views import about as AboutView, StatisticsView

app_name = 'setting'
urlpatterns = [
    path('about', AboutView, name='about'),
    path('setting/stats/', StatisticsView.as_view(), name='statistics'),
]
