from django.db import models
from django.conf import settings

class Test(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class API(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()
    description = models.TextField()
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

class Result(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    detail = models.TextField()
    executed_at = models.DateTimeField(auto_now_add=True)