# Security Test API

Security Test API is a web application designed for automated testing of security vulnerabilities in web APIs, focusing on the OWASP Top 10 vulnerabilities. The project combines the robust backend capabilities of Django Rest Framework with the dynamic and interactive user interface provided by React.

## Features

- **Automated Vulnerability Testing:** Supports the detection of key security vulnerabilities outlined in the OWASP Top 10.
- **Interactive User Interface:** Allows users to easily manage tests and review detailed results.
- **Customizable Tests:** Users can choose specific vulnerabilities they wish to test against their APIs.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Python (version 3.x)
- Node.js, npm and yarn

### Setting Up the Project

#### 1. Cloning the Repository
Clone the repository to your local machine:
```bash
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

4. **Running the Django application**

You can run the application in debug mode using VS Code or manually
```
cd .\App\
python manage.py runserver
```

5. **Installation of Frontend Dependencies**
In a new Terminal/Tab:
```
cd frontend
cd .\Security-Test-API\
yarn install
```

6. **Running the React Application**
```
yarn dev
```
The application should be accessible at `http://localhost:5157`, while the Django API is available at `http://localhost:8000`.

## Using the Application

- Open a web browser and visit `http://localhost:5157`.
- Enter the URL of the API you want to test and select the types of vulnerabilities to test.
- Review the results for the discovered vulnerabilities.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

Project Link: https://github.com/MarioZitko/Security-Test-API
