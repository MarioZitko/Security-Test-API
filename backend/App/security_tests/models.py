from django.db import models
from django.conf import settings
from . import security_checks

class Test(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    test_function = models.CharField(max_length=100, null=True)
    
    def run_test(self, api_url):
        if hasattr(security_checks, self.test_function):
            test_func = getattr(security_checks, self.test_function)
            status, detail = test_func(api_url)
            return status, detail
        return "Error", "Test function not implemented."

class API(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()
    description = models.TextField()
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

class TestStatus(models.TextChoices):
    VULNERABLE = 'Vulnerable', 'Vulnerable'
    ERROR = 'Error', 'Error'
    SAFE = 'Safe', 'Safe'

class Result(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    api = models.ForeignKey(API, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=TestStatus.choices, default=TestStatus.SAFE)
    detail = models.TextField(default="")
    executed_at = models.DateTimeField(auto_now_add=True)
    executed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
