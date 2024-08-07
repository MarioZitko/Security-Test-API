# security_tests/security_checks.py
import requests
import json
import time
import os
from urllib.parse import quote

# Constants
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
    
def test_get(api_url, payload, error_indicators, param=''):
    try:
        response = requests.get(f"{api_url}/{param}/{quote(payload)}", timeout=10)
        return analyze_response(response, error_indicators)
    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to test {param} with GET due to: {str(e)}")
        return False
    
def test_sql_get(api_url, payload, error_indicators, param=''):
    try:
        response = requests.get(f"{api_url}?{param}={quote(payload)}", timeout=10)
        return analyze_response(response, error_indicators)
    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to test {param} with GET due to: {str(e)}")
        return False

def test_post(api_url, payload, error_indicators, param=''):
    data = {param: payload}
    headers = {'Content-Type': 'application/json'} # Json data payload type
    try:
        response = requests.post(api_url, data=data, headers=headers, timeout=10)
        return analyze_response(response, error_indicators)
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

def analyze_response(response, error_indicators):
    text = response.text.lower()
    # Check for error indicators in response text
    if any(indicator in text for indicator in error_indicators):
        print(f"Vulnerable: Detected error indicator with payload.")
        return True

   # Analyze based on specific indicators of a successful injection
    if response.status_code == 200:
        # Check for specific data that shouldn't normally be accessible
        if check_for_sensitive_data(text):
            print(f"Vulnerable: Possible data leakage detected with payload.")
            return True
    elif response.status_code == 500:
        # A server error might indicate that the payload has some disruptive effect
        print(f"Vulnerable: Server error potentially caused.")
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
    error_indicators = load_data(os.path.join(FILE_DIR, 'error_indicators.txt'))
    # Combine all payloads into one list
    all_payloads = sum(payloads.values(), [])

    parameters = load_data(os.path.join(FILE_DIR, 'parameters.txt'))
    vulnerabilities = []

    # Testing each parameter with all payloads
    for param in parameters:
        for payload in all_payloads:
            if test_sql_get(api_url, payload, error_indicators, param):
                vulnerabilities.append((param, payload, error_indicators, 'GET'))
            if test_post(api_url, payload, error_indicators, param):
                vulnerabilities.append((param, payload, error_indicators, 'POST'))

    if vulnerabilities:
        return "Vulnerable", vulnerabilities
    return "Safe", "No vulnerabilities detected."

def test_xss(api_url):
    # Common XSS payloads
    payloads = load_data(os.path.join(FILE_DIR, 'xss_payloads.txt'))
    vulnerabilities = []
    parameters = load_data(os.path.join(FILE_DIR, 'parameters.txt'))
    error_indicators = load_data(os.path.join(FILE_DIR, 'error_indicators.txt'))
    
    for param in parameters:
        for payload in payloads:
            # Encode the payload for URL usage
            encoded_payload = quote(payload)

            # Test GET method
            if test_get(api_url, encoded_payload, error_indicators, param):
                vulnerabilities.append((param, payload, error_indicators, 'GET'))

            # Test POST method
            if test_post(api_url, encoded_payload, error_indicators, param):
                vulnerabilities.append((param, payload, error_indicators, 'POST'))

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
    error_indicators = load_data(os.path.join(FILE_DIR, 'command_error_indicators.txt'))

    for payload in payloads:
        try:
            encoded_payload = quote(payload)
            
            # Test GET method
            if test_get(api_url, "cmd", encoded_payload, error_indicators):
                return "Vulnerable", f"Command injection might be possible with payload: {payload} using GET"

            # Test POST method
            if test_post(api_url, "cmd", encoded_payload, error_indicators):
                return "Vulnerable", f"Command injection might be possible with payload: {payload} using POST"

        except requests.exceptions.RequestException as e:
            return "Error", f"Failed to test due to network or connection error: {str(e)}"
    
    return "Safe", "No command injection vulnerabilities detected."
    
def load_credentials(file_path):
    """
    Load credentials from a file, expecting each line to contain a username and password separated by a colon.

    Args:
        file_path (str): Path to the file containing credentials formatted as 'username:password'.

    Returns:
        list of tuples: List of (username, password) tuples.
    """
    raw_data = load_data(file_path)
    credentials = []

    # Process each line to extract username and password
    for line in raw_data:
        parts = line.split(':')
        if len(parts) == 2:
            credentials.append((parts[0], parts[1]))
        else:
            print(f"Skipping malformed line: {line}")
    return credentials

def test_broken_authentication(api_url):
    """
    Test for Broken Authentication vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    # Common weak credentials to test
    common_credentials = load_credentials(os.path.join(FILE_DIR, 'common_credentials.txt'))

    # Endpoint assumed for authentication
    auth_endpoints = load_data(os.path.join(FILE_DIR, 'auth_endpoints.txt'))
    
    for endpoint in auth_endpoints:
        for username, password in common_credentials:
            try:
                full_endpoint = f"{api_url}/{endpoint}"
                response = requests.post(full_endpoint, json={"username": username, "password": password})
                if response.ok and "login successful" in response.text.lower():
                    return "Vulnerable", f"Broken authentication detected with username: {username}, password: {password}, on endpoint {full_endpoint}"
                elif response.status_code in [401, 403]:  # Unauthorized or Forbidden
                    continue  # Expected unsuccessful response, check next credentials
            except requests.exceptions.RequestException as e:
                print(f"Network or connection error: {str(e)}")  # Log the error for debugging
                continue  # Continue testing other credentials despite the error

    return "Safe", "No broken authentication vulnerabilities detected."

def test_sensitive_data_exposure(api_url):
    """
    Enhanced test for Sensitive Data Exposure vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    # Load sensitive data keywords from a file
    sensitive_keywords = load_data(os.path.join(FILE_DIR, 'sensitive_data_indicators.txt'))
    parameters = load_data(os.path.join(FILE_DIR, 'parameters.txt'))

    try:
        for param in parameters:
            # Make a request to the API and capture the response
            response = requests.get(f"{api_url}/{param}")

            # Check if sensitive keywords are present in the response body
            if check_for_sensitive_data(response.text):
                found_keywords = [keyword for keyword in sensitive_keywords if keyword in response.text.lower()]
                return "Vulnerable", f"Sensitive data exposed in response body: {', '.join(found_keywords)}"

            # Check if sensitive keywords are present in the response headers
            header_data = ' '.join([f"{key}: {value}" for key, value in response.headers.items()])
            if check_for_sensitive_data(header_data):
                found_keywords = [keyword for keyword in sensitive_keywords if keyword in header_data.lower()]
                return "Vulnerable", f"Sensitive data exposed in headers: {', '.join(found_keywords)}"

    except requests.exceptions.RequestException as e:
        return "Error", f"Failed to test due to network or connection error: {str(e)}"

    return "Safe", "No sensitive data exposure vulnerabilities detected."

def test_xxe(api_url):
    """
    Test for XML External Entities (XXE) vulnerabilities using multiple payloads.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    # Load XXE payloads from a file
    xxe_payloads = load_data(os.path.join(FILE_DIR, 'xxe_payloads.txt'))
    headers = {'Content-Type': 'application/xml'}

    for xxe_payload in xxe_payloads:
        try:
            # Ensure the payload is properly formatted
            xxe_payload = xxe_payload.strip()
            if not xxe_payload:
                continue

            # Send the XXE payload as a POST request with XML content-type
            response = requests.post(api_url, data=xxe_payload, headers=headers)

            # Check if the response contains any typical indicators of file content
            if "root:" in response.text or "bin:" in response.text or "/bin/bash" in response.text:
                return "Vulnerable", f"XXE vulnerability detected. Sensitive file contents exposed with payload: {xxe_payload}"

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
    payloads = load_data(os.path.join(FILE_DIR, 'deserialization_payloads.txt'))
    headers = {'Content-Type': 'application/octet-stream'}
    
    attack_indicators = [
        "root:x",           # Common pattern in /etc/passwd
        "bin:x",            # Another common pattern in /etc/passwd
        "daemon:x",         # Typical user entry in /etc/passwd
        "command not found",  # Response when an unknown command is executed
        "syntax error",     # Possible output if the serialization breaks PHP/Java syntax
        "total",            # Common output from 'ls -la', indicating command execution
        "drwx",             # Directory listing from 'ls -la'
        "insecure deserialization",  # Direct indication of vulnerability exploitation
        "exploit executed",  # Custom message that might be used in crafted payloads
        "remote code executed",  # Indication of remote code execution
        "command executed"  # Generic indication that any command was executed
    ]

    for payload in payloads:
        try:
            response = requests.post(api_url, data=payload, headers=headers)
            # Check for typical signs of successful deserialization attacks
            for indicator in attack_indicators:
                if indicator in response.text.lower():
                    return "Vulnerable", f"Insecure deserialization detected with payload: {payload}, attack indicator {indicator}"

        except requests.exceptions.RequestException as e:
            return "Error", f"Failed to test due to network or connection error: {str(e)}"

    return "Safe", "No insecure deserialization vulnerabilities detected."

def test_security_misconfiguration(api_url):
    """
    Enhanced test for Security Misconfiguration vulnerabilities.
    
    Args:
        api_url (str): The URL of the API endpoint to test.
        
    Returns:
        tuple: A tuple containing the status ('Vulnerable' or 'Safe') and a detail message.
    """
    # Extend the list of paths to check for common misconfigurations
    misconfigurations = [
        ('/admin', 'Admin interface exposed'),
        ('/config.php', 'Configuration file exposed'),
        ('/.git', 'Git directory exposed'),
        ('/.env', '.env file exposed'),
        ('/backup', 'Backup file or directory exposed'),
        ('/debug', 'Debug interface exposed'),
        ('/phpinfo.php', 'phpinfo() exposed'),
        ('/test', 'Test directory exposed'),
        ('/temp', 'Temporary directory exposed'),
        ('/database', 'Database file exposed')
    ]

    for path, description in misconfigurations:
        try:
            full_url = f"{api_url}{path}"
            response = requests.get(full_url)
            
            # Check for 200 OK, but also other informative status codes
            if response.status_code == 200:
                if "Not Found" not in response.text:
                    return "Vulnerable", f"{description}: {full_url}"
            elif response.status_code in [403, 401]:
                return "Vulnerable", f"{description} (access restricted but present): {full_url}"

        except requests.exceptions.RequestException as e:
            return "Error", f"Failed to test due to network or connection error: {str(e)}"

    return "Safe", "No security misconfiguration vulnerabilities detected."