"""
URL configuration for App project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from accounts.views import UserViewSet
from security_tests.views import TestViewSet, APIViewSet, ResultViewSet, run_tests_for_api, run_single_test, view_results

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'apis', APIViewSet, basename='api') 
router.register(r'tests', TestViewSet, basename='test')  # This creates /api/tests/
router.register(r'results', ResultViewSet, basename='result')  # This creates /api/results/

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('run-tests/<int:api_id>/', run_tests_for_api, name='run-tests-for-api'),
    path('run-test/<int:api_id>/<int:test_id>/', run_single_test, name='run-single-test'),
    path('view-results/<int:api_id>/', view_results, name='view-results'),
]
