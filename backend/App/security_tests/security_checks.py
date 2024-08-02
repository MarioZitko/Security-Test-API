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

def test_xss(api_url):
    """
    Test for Cross-Site Scripting (XSS) vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    # Common XSS payloads
    payloads = [
        "<script>alert('XSS')</script>",
        "\";alert('XSS');//",
        "\"><script>alert('XSS')</script>",
        "<img src=x onerror=alert('XSS')>",
        "<svg/onload=alert('XSS')>",
    ]

    # Iterate over each payload to test for XSS
    for payload in payloads:
        try:
            # Simulate a POST request with payload as a user input
            response = requests.post(api_url, data={'user_input': payload})

            # Check if the payload appears in the response text
            if payload in response.text:
                return "Vulnerable", f"XSS possible with payload: {payload}"
        except requests.exceptions.RequestException as e:
            return "Error", f"Failed to test due to network or connection error: {str(e)}"
    
    return "Safe", "No XSS vulnerabilities detected."

def test_csrf(api_url):
    """
    Test for Cross-Site Request Forgery (CSRF) vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    try:
        # Attempt to make a POST request without CSRF token
        response = requests.post(api_url, data={'action': 'test_csrf'}, cookies={'sessionid': 'fake-session-id'})
        
        # Check for signs of CSRF protection (e.g., 403 status, specific error message)
        if response.status_code == 403 or "CSRF token" in response.text:
            return "Safe", "CSRF protection is enabled."
        
        return "Vulnerable", "CSRF protection is not enabled. The request succeeded without a CSRF token."
    
    except requests.exceptions.RequestException as e:
        return "Error", f"Failed to test due to network or connection error: {str(e)}"
    
    
    
