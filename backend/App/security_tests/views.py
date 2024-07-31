from rest_framework import viewsets
from .models import Test, API, Result
from .serializers import TestSerializer, APISerializer, ResultSerializer
from .utils import api_response

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(data=serializer.data)

def run_tests_for_api(api_id):
    api = API.objects.get(id=api_id)
    tests = Test.objects.all()
    results = []
    for test in tests:
        status, detail = test.run_test(api.url)
        result = Result(test=test, api=api, status=status, detail=detail, executed_by=api.added_by)
        result.save()
        results.append({"test": test.name, "status": status, "detail": detail})
    return api_response(data=results)

def view_results(request, api_id):
    results = Result.objects.filter(api_id=api_id)
    data = [{"test": result.test.name, "status": result.status, "detail": result.detail} for result in results]
    return api_response(data=data)

class APIViewSet(viewsets.ModelViewSet):
    queryset = API.objects.all()
    serializer_class = APISerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(data=serializer.data)

class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(data=serializer.data)
