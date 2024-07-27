from rest_framework import viewsets
from .models import Test, API, Result
from .serializers import TestSerializer, APISerializer, ResultSerializer
from django.http import JsonResponse

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    
def run_tests_for_api(api_id):
    api = API.objects.get(id=api_id)
    tests = Test.objects.all()
    results = []
    for test in tests:
        status, detail = test.run_test(api.url)
        result = Result(test=test, api=api, status=status, detail=detail, executed_by=api.added_by)
        result.save()
        results.append(f"{test.name}: {status} - {detail}")
    return JsonResponse(results, safe=False)

def view_results(request, api_id):
    results = Result.objects.filter(api_id=api_id)
    data = [{"test": result.test.name, "status": result.status, "detail": result.detail} for result in results]
    return JsonResponse(data, safe=False)


class APIViewSet(viewsets.ModelViewSet):
    queryset = API.objects.all()
    serializer_class = APISerializer

class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
