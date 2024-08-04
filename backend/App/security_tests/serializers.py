from rest_framework import serializers
from .models import Test, API, Result

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'

class APISerializer(serializers.ModelSerializer):
    class Meta:
        model = API
        fields = '__all__'

class ResultSerializer(serializers.ModelSerializer):
    test = TestSerializer()  # Nest the TestSerializer
    api = APISerializer()    # Nest the APISerializer
    
    class Meta:
        model = Result
        fields = '__all__'
