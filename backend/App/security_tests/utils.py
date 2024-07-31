# utils.py
from rest_framework.response import Response

def api_response(data=None, message=None, status=200):
    response = {
        'data': data,
        'message': message
    }
    return Response(response, status=status)
