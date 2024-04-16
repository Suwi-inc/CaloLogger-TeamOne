# CaloLogger
## A Daily Calories Intake and Weight Tracker

**CaloLogger** is a web application designed to help users monitor their daily caloric intake and track weight changes over time.

### Features:

1. **Secure Registration and Authentication:**
   - Allows users to create accounts and securely authenticate to access personalized data.

2. **Meal Data Management:**
   - **Add Meal Data:** Users can select meals and add descriptions.
   - **Utilizes the CalorieNinjas API** to fetch nutritional information.
   - **View Meal Data:** Presents meal data in a simple dashboard format for easy visualization.
   - **Delete Meal Data:** Enables users to remove unwanted meal entries from their records.

3. **Weight Tracking:**
   - **Add Weight Data:** Users can input and store weight measurements.
   - **View Weight Data:** Displays historical weight data for users to track changes over time.

4. **Graphical Representation:**
   - **Daily Calories Intake Change:** Graphical representation illustrating daily calorie intake fluctuations.
   - **Daily Weight Change:** Graphical depiction of weight changes on a daily basis.

### Integration:
- **CalorieNinjas API for nutritional data:** [CalorieNinjas](https://calorieninjas.com/api)

### Project Quality Requirements:

#### Maintainability
- **Testability:** The codebase should have at least 65% line coverage for test cases.
- **Modifiability:** The codebase should have a maintainability index of at least 70, measured using [Radon](https://pypi.org/project/radon).
- **Flake 8:** The project should pass Flake 8 checks without warnings.

#### Reliability
- **Availability:** The API server should have an uptime of more than 99% within a one-week window, monitored by [Uptime Robot](https://uptimerobot.com/).

#### Performance
- **Time behavior:** The web application should have an average response time of no more than 2000 milliseconds under typical network speeds (50mb/s upload and download).

#### Security
- **Integrity:** In addition to meeting minimum Bandit requirements, the codebase should have zero high and medium-level vulnerabilities on Snyk.
- **Accountability:** User actions (creations/deletions) should be logged, and logs should be kept for at least a day before they are rotated to ensure actions can be traced uniquely back to users.
- **Data Protection:** All confidential personal data (passwords) should be stored in an encrypted state.


# File structure

```
calorie-tracker/
│
├── backend/
|   └──app/                       # Main application package
│      ├── __init__.py            # Initializes the Python package
│      ├── main.py                # Entry point to the FastAPI app, includes route definitions
│      ├── dependencies.py        # Dependency provider functions, e.g., get_db
│      ├── database.py            # Database configuration, session management
│      ├── models.py              # Database models
│      ├── schemas.py             # Pydantic schemas for request and response models
│      ├── crud.py                # CRUD utilities to interact with the database models
│      ├── security.py            # Security-related functions, e.g., token verification
│      └── api/                   # API specific modules (optional breakdown)
│       ├── __init__.py
│       ├── users.py              # User related routes
│       ├── meals.py              # Meal related routes
│       └── auth.py               # Authentication related routes
│
├── frontend/                     # Frontend part using Streamlit
│   ├── __init__.py
│   └── streamlit_app.py          # Streamlit frontend application
│
├── tests/                        # Test modules
│   ├── __init__.py
│   ├── test_main.py              # Tests for main application logic
│   ├── test_database.py          # Database related tests
│   └── test_api.py               # Tests for API endpoints
│
├── poetry.lock                   # Poetry lock file to ensure reproducible installs
├── pyproject.toml                # Poetry configuration file with dependencies and package info
├── README.md                     # Project overview and setup instructions
└── .gitignore                    # Specifies intentionally untracked files to ignore
```
