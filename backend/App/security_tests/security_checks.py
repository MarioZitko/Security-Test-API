# security_tests/security_checks.py
import requests
import json
import time
import os

# Function to read payloads and error indicators from external files
def load_payloads(file_path):
    try:
        with open(file_path, 'r') as file:
            return [line.strip() for line in file.readlines() if line.strip()]
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return []

def test_sql_injection(api_url):
    # Load payloads and error indicators from external files
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    PAYLOADS_DIR = os.path.join(BASE_DIR, 'payloads')

    classic_payloads = load_payloads(os.path.join(PAYLOADS_DIR, 'classic_payloads.txt'))
    time_based_payloads = load_payloads(os.path.join(PAYLOADS_DIR, 'time_based_payloads.txt'))
    union_based_payloads = load_payloads(os.path.join(PAYLOADS_DIR, 'union_based_payloads.txt'))
    boolean_payloads = load_payloads(os.path.join(PAYLOADS_DIR, 'boolean_payloads.txt'))
    waf_bypass_payloads = load_payloads(os.path.join(PAYLOADS_DIR, 'waf_bypass_payloads.txt'))
    comment_payloads = load_payloads(os.path.join(PAYLOADS_DIR, 'comment_payloads.txt'))
    error_indicators = load_payloads(os.path.join(PAYLOADS_DIR, 'error_indicators.txt'))

    # Combine all payloads into one list
    all_payloads = (
        classic_payloads +
        time_based_payloads +
        union_based_payloads +
        boolean_payloads +
        waf_bypass_payloads +
        comment_payloads
    )

    # List of parameters to test
    parameters = ['username', 'password', 'email', 'search']

    # Iterate through each parameter and payload
    for param in parameters:
        for payload in all_payloads:
            # Use GET request for testing simple queries (comment if not applicable)
            test_get(api_url, param, payload, error_indicators)

            # Use POST request for testing form submissions
            test_post(api_url, param, payload, error_indicators)

    return "Safe", "No vulnerabilities detected."

def test_get(api_url, param, payload, error_indicators):
    try:
        response = requests.get(api_url, params={param: payload}, timeout=10)
        if analyze_response(response, error_indicators, param, payload):
            return

    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to test {param} due to network or connection error: {str(e)}")

def test_post(api_url, param, payload, error_indicators):
    data = {param: payload}
    try:
        response = requests.post(api_url, data=data, timeout=10)
        if analyze_response(response, error_indicators, param, payload):
            return

    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to test {param} due to network or connection error: {str(e)}")

def analyze_response(response, error_indicators, param, payload):
    # Check for SQL error indicators in response
    if any(indicator in response.text.lower() for indicator in error_indicators):
        print(f"Vulnerable: SQL Injection possible with payload on '{param}': {payload}")
        return True

    # Check for typical SQL injection behavior in the response
    if response.status_code == 200 and "Welcome" in response.text:
        print(f"Authentication bypass achieved with payload on '{param}': {payload}")
        return True

    # Additional checks for union-based payloads
    if "union select" in payload.lower() and "test" in response.text:
        print(f"Union-based SQL Injection detected with payload on '{param}': {payload}")
        return True

    # Additional checks for time-based payloads
    if "sleep" in payload.lower() or "waitfor" in payload.lower():
        # If the response time exceeds a threshold, it's a sign of time-based SQL injection
        start_time = time.time()
        elapsed_time = time.time() - start_time
        if elapsed_time > 10:
            print(f"Time-based SQL Injection detected with payload on '{param}': {payload}")
            return True

    return False

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