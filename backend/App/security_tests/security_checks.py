# security_tests/security_checks.py
import requests
import json
import time
import os
from urllib.parse import quote

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_DIR = os.path.join(BASE_DIR, 'txt_data')

#region Helper Methods

def load_data(file_path):
    try:
        with open(file_path, 'r') as file:
            return [line.strip() for line in file.readlines() if line.strip()]
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return []

def check_api_accessibility(api_url):
    try:
        response = requests.get(api_url, timeout=5)
        response.raise_for_status()
        return True
    except (requests.exceptions.RequestException, requests.exceptions.HTTPError) as e:
        print(f"API is not accessible. Failed due to: {str(e)}")
        return False
    
def test_get(api_url, payload, param=''):
    try:
        response = requests.get(f"{api_url}?{param}={quote(payload)}", timeout=10)
        return analyze_response(response)
    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to test {param} with GET due to: {str(e)}")
        return False

def test_post(api_url, payload, param=''):
    data = {param: payload}
    try:
        response = requests.post(api_url, data=data, timeout=10)
        return analyze_response(response)
    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to test {param} with POST due to: {str(e)}")
        return False
    
def check_for_sensitive_data(response_text):
    sensitive_keywords = load_data(os.path.join(FILE_DIR, 'sensitive_data_indicators.txt'))
    # Check if any of the sensitive data indicators are present in the response
    for keyword in sensitive_keywords:
        if keyword in response_text.lower():
            print(f"Sensitive data detected: {keyword}")
            return True
    return False

def analyze_response(response):
    error_indicators = load_data(os.path.join(FILE_DIR, 'error_indicators.txt'))
    text = response.text.lower()
    # Check for SQL error indicators in response text
    if any(indicator in text for indicator in error_indicators):
        print(f"Vulnerable: Detected SQL error indicator with payload.")
        return True

   # Analyze based on specific indicators of a successful injection
    if response.status_code == 200:
        # Check for specific data that shouldn't normally be accessible
        if check_for_sensitive_data(text):
            print(f"Vulnerable: Possible data leakage detected with payload.")
            return True
    elif response.status_code == 500:
        # A server error might indicate that the SQL injection has some disruptive effect
        print(f"Vulnerable: Server error potentially caused by SQL injection.")
        return True
    
    # Additional generic checks can be added here
    if "unauthorized" in text or "forbidden" in text:
        print("Potential security misconfiguration or inadequate permissions.")
        return True

    return False

#endregion

def test_sql_injection(api_url):
    if not check_api_accessibility(api_url):
        return "API Unreachable", "Test aborted due to API inaccessibility."
    
    # Load different types of payloads
    payload_types = ['classic', 'time_based', 'union_based', 'boolean', 'waf_bypass', 'comment']
    payloads = {ptype: load_data(os.path.join(FILE_DIR, f"{ptype}_payloads.txt")) for ptype in payload_types}

    # Combine all payloads into one list
    all_payloads = sum(payloads.values(), [])

    parameters = load_data(os.path.join(FILE_DIR, 'parameters.txt'))
    vulnerabilities = []

    # Testing each parameter with all payloads
    for param in parameters:
        for payload in all_payloads:
            if test_get(api_url, payload, param):
                vulnerabilities.append((param, payload, 'GET'))
            if test_post(api_url, payload, param):
                vulnerabilities.append((param, payload, 'POST'))

    if vulnerabilities:
        return "Vulnerable", vulnerabilities
    return "Safe", "No vulnerabilities detected."


def test_xss(api_url):
    # Common XSS payloads
    payloads = load_data(os.path.join(FILE_DIR, 'xss_payloads.txt'))
    vulnerabilities = []
    parameters = load_data(os.path.join(FILE_DIR, 'parameters.txt'))
    
    for param in parameters:
        for payload in payloads:
            # Encode the payload for URL usage
            encoded_payload = quote(payload)

            # Test GET method
            if test_get(api_url, encoded_payload, param):
                vulnerabilities.append((param, payload, 'GET'))

            # Test POST method
            if test_post(api_url, encoded_payload, param):
                vulnerabilities.append((param, payload, 'POST'))

    if vulnerabilities:
        return "Vulnerable", vulnerabilities
    return "Safe", "No XSS vulnerabilities detected."

def test_csrf(api_url):
    """
    Enhanced test for Cross-Site Request Forgery (CSRF) vulnerabilities.

    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable', 'Safe', or 'Error') and a detailed message.
    """
    headers = {'Content-Type': 'application/json'}
    data = '{"action": "test_csrf"}'
    cookies = {'sessionid': 'fake-session-id'}
    methods = ['POST', 'PUT', 'DELETE', 'PATCH']  # Testing multiple methods for CSRF

    for method in methods:
        try:
            response = requests.request(method, api_url, headers=headers, data=data, cookies=cookies, timeout=10)
            
            # Generalized check for CSRF or other authorization failures
            if response.status_code in [403, 401]:
                if "csrf" in response.text.lower():
                    return "Safe", f"CSRF protection detected with {method} method."
                continue  # Check next method if generic 403/401 without mention of CSRF

        except requests.exceptions.RequestException as e:
            return "Error", f"Failed to test {method} due to network or connection error: {str(e)}"

    return "Vulnerable", "CSRF protection is not adequately enabled across methods."
    
def test_command_injection(api_url):
    """
    Test for Command Injection vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    # Command injection payloads
    payloads = [
        "; ls",  # Unix
        "&& dir",  # Windows
        "| cat /etc/passwd",  # Unix
        "| whoami",  # Unix
        "& net user",  # Windows
    ]

    # Expected error messages for failed command execution
    error_indicators = ["No such file or directory", "is not recognized as an internal or external command", "command not found"]

    for payload in payloads:
        try:
            # Send the payload as part of a query parameter
            response = requests.get(api_url, params={'input': payload})
            
            # Analyze response text for typical command output or error indicators
            if any(indicator in response.text for indicator in error_indicators):
                continue  # This indicates a failed execution, which is expected

            if "root" in response.text or "Administrator" in response.text:
                return "Vulnerable", f"Command injection possible with payload: {payload}"

        except requests.exceptions.RequestException as e:
            return "Error", f"Failed to test due to network or connection error: {str(e)}"
    
    return "Safe", "No command injection vulnerabilities detected."
    
def test_broken_authentication(api_url):
    """
    Test for Broken Authentication vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    # Common weak credentials to test
    common_credentials = [
        ("admin", "admin"),
        ("admin", "password"),
        ("user", "123456"),
        ("guest", "guest"),
        ("root", "toor"),
    ]

    # Endpoint assumed for authentication
    auth_endpoint = f"{api_url}/login"

    for username, password in common_credentials:
        try:
            # Attempt to authenticate with weak credentials
            response = requests.post(auth_endpoint, data={"username": username, "password": password})
            
            # Check if login is successful (usually indicated by a 200 status code or specific message)
            if response.status_code == 200 and "login successful" in response.text.lower():
                return "Vulnerable", f"Broken authentication detected with username: {username}, password: {password}"
        
        except requests.exceptions.RequestException as e:
            return "Error", f"Failed to test due to network or connection error: {str(e)}"

    return "Safe", "No broken authentication vulnerabilities detected."

def test_sensitive_data_exposure(api_url):
    """
    Test for Sensitive Data Exposure vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    # Sample sensitive data keywords to look for
    sensitive_keywords = [
        "password",
        "credit card",
        "social security number",
        "api key",
        "token",
    ]

    try:
        # Make a request to the API and capture the response
        response = requests.get(api_url)
        
        # Check if sensitive keywords are present in the response
        for keyword in sensitive_keywords:
            if keyword in response.text.lower():
                return "Vulnerable", f"Sensitive data exposed: {keyword}"

        # Check if the response includes any sensitive headers
        for header in response.headers:
            if any(keyword in header.lower() for keyword in sensitive_keywords):
                return "Vulnerable", f"Sensitive data exposed in headers: {header}"
        
    except requests.exceptions.RequestException as e:
        return "Error", f"Failed to test due to network or connection error: {str(e)}"

    return "Safe", "No sensitive data exposure vulnerabilities detected."

def test_xxe(api_url):
    """
    Test for XML External Entities (XXE) vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    # XXE payload
    xxe_payload = """<?xml version="1.0" encoding="ISO-8859-1"?>
    <!DOCTYPE foo [  
    <!ELEMENT foo ANY >
    <!ENTITY xxe SYSTEM "file:///etc/passwd" >]>  
    <foo>&xxe;</foo>"""

    try:
        # Send the XXE payload as a POST request with XML content-type
        headers = {'Content-Type': 'application/xml'}
        response = requests.post(api_url, data=xxe_payload, headers=headers)

        # Check if the response contains the content of the file
        if "root:" in response.text or "bin:" in response.text:
            return "Vulnerable", "XXE vulnerability detected. Sensitive file contents exposed."

    except requests.exceptions.RequestException as e:
        return "Error", f"Failed to test due to network or connection error: {str(e)}"

    return "Safe", "No XXE vulnerabilities detected."

def test_insecure_deserialization(api_url):
    """
    Test for Insecure Deserialization vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    # Malicious payload for deserialization attack
    payload = """O:8:"Exploit":1:{s:4:"test";s:24:"insecure deserialization";}"""

    try:
        # Send the payload as a POST request to the API
        headers = {'Content-Type': 'application/octet-stream'}
        response = requests.post(api_url, data=payload, headers=headers)

        # Check for typical signs of successful deserialization attacks
        if "insecure deserialization" in response.text:
            return "Vulnerable", "Insecure deserialization detected. Malicious payload was processed."

    except requests.exceptions.RequestException as e:
        return "Error", f"Failed to test due to network or connection error: {str(e)}"

    return "Safe", "No insecure deserialization vulnerabilities detected."

def test_security_misconfiguration(api_url):
    """
    Test for Security Misconfiguration vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    # Common misconfigurations to test for
    misconfigurations = [
        ('/admin', 'Admin interface exposed'),
        ('/config.php', 'Configuration file exposed'),
        ('/.git', 'Git directory exposed'),
        ('/.env', '.env file exposed'),
        ('/backup', 'Backup file or directory exposed')
    ]

    for path, description in misconfigurations:
        try:
            # Check if the misconfigured path is accessible
            response = requests.get(f"{api_url}{path}")
            
            # If the status code is 200, the path is exposed
            if response.status_code == 200:
                return "Vulnerable", f"{description}: {path}"
        
        except requests.exceptions.RequestException as e:
            return "Error", f"Failed to test due to network or connection error: {str(e)}"

    return "Safe", "No security misconfiguration vulnerabilities detected."

def test_components_with_vulnerabilities(api_url):
    """
    Test for Components with Known Vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    try:
        # Assume there's an endpoint that provides component information
        response = requests.get(f"{api_url}/components")
        
        # Sample response: [{"name": "library1", "version": "1.0"}, {"name": "library2", "version": "2.3"}]
        components = response.json()

        # Known vulnerable components
        vulnerable_components = {
            "library1": "1.0",
            "library2": "2.3",
            "jquery": "1.12.4",
            "bootstrap": "3.4.1"
        }

        for component in components:
            name = component.get("name")
            version = component.get("version")

            # Check if the component is known to be vulnerable
            if name in vulnerable_components and vulnerable_components[name] == version:
                return "Vulnerable", f"Component {name} version {version} is known to be vulnerable."

    except requests.exceptions.RequestException as e:
        return "Error", f"Failed to test due to network or connection error: {str(e)}"
    except json.JSONDecodeError as e:
        return "Error", f"Failed to decode JSON response: {str(e)}"

    return "Safe", "No components with known vulnerabilities detected."