# Security Test API

Security Test API is a web application designed for automated testing of security vulnerabilities in web APIs, with a focus on OWASP Top 10 vulnerabilities. The project combines the power of Flask for backend logic and React for interactive user interface.

## Features

- **Automated Vulnerability Testing:** Supports detection of key security vulnerabilities declared in OWASP Top 10.
- **Interactive User Interface:** Enables users to easily manage tests and review results.
- **Customizable Tests:** Users can select specific vulnerabilities they want to test.

## Getting Started

To run the project locally, follow the instructions below.

### Requirements

- Python (version 3.x)
- Node.js and npm

### Setting Up the Project

1. **Cloning the Repository**
```
git clone https://github.com/MarioZitko/Security-Test-API.git
cd Security-Test-API
```

2. **Setting Up and configuring the Virtual Environment**
```
python -m venv venv
```

**Windows**
```
venv\Scripts\activate
```

**Unix or MacOS**
```
source venv/bin/activate
```

3. **Installation of Backend Dependencies**
```
cd backend
pip install -r requirements.txt
```

4. **Running the Flask application**
```
flask run
```

5. **Installation of Frontend Dependencies**
In a new Terminal/Tab:
```
cd frontend
npm install
```

6. **Running the React Application**
```
npm start
```
The application should be accessible at `http://localhost:3000`, while the Flask API is available at `http://localhost:5000`.

## Using the Application

- Open a web browser and visit `http://localhost:3000`.
- Enter the URL of the API you want to test and select the types of vulnerabilities to test.
- Review the results and recommendations for mitigating the discovered vulnerabilities.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

Project Link: https://github.com/MarioZitko/Security-Test-API
