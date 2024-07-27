# security_tests/security_checks.py
import requests

def test_sql_injection(api_url):
    payloads = ["admin' --", "' OR '1'='1", "' OR '1'='1' --", "' OR '1'='1' /*"]
    error_indicators = ["syntax error", "sql error", "unclosed quotation mark"]
    for payload in payloads:
        try:
            response = requests.post(api_url, data={'user_input': payload})
            if any(indicator in response.text.lower() for indicator in error_indicators):
                return "Vulnerable", f"SQL Injection possible with payload: {payload}"
        except requests.exceptions.RequestException as e:
            return "Error", f"Failed to test due to network or connection error: {str(e)}"
    return "Safe", "No vulnerabilities detected."
