# views.py
from rest_framework.decorators import api_view
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

@api_view(['POST'])
def run_tests_for_api(request, api_id):
    api = API.objects.get(id=api_id)
    tests = Test.objects.all()
    results = []
    for test in tests:
        status, detail = test.run_test(api.url)
        result = Result(test=test, api=api, status=status, detail=detail, executed_by=api.added_by)
        result.save()
        results.append({"testId": test.id, "status": status, "detail": detail})
    return api_response(data=results)

@api_view(['POST'])
def run_single_test(request, api_id, test_id):
    try:
        api = API.objects.get(id=api_id)
        test = Test.objects.get(id=test_id)
        status, detail = test.run_test(api.url)
        result = Result(test=test, api=api, status=status, detail=detail, executed_by=api.added_by)
        result.save()
        return api_response(data={"testId": test.id, "status": status, "detail": detail})
    except API.DoesNotExist:
        return api_response(data=None, message="API not found.", status=404)
    except Test.DoesNotExist:
        return api_response(data=None, message="Test not found.", status=404)
    except Exception as e:
        return api_response(data=None, message=str(e), status=500)

@api_view(['GET'])
def view_results(request, api_id):
    results = Result.objects.filter(api_id=api_id)
    serializer = ResultSerializer(results, many=True)
    return api_response(data=serializer.data)

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
