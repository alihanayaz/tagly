<div align="center">
  <br>
  <h1><b>Tagly</b></h1>
  <strong>Simple and intuitive bookmark manager</strong>
</div>
<br>
<table align="center" style="border-collapse:separate;">
  <tr>
    <td><small>Python</small></td>
    <td><small>Django</small></td>
    <td><small>JavaScript</small></td>
    <td><small>PostgreSQL</small></td>
    <td><small>HTML</small></td>
    <td><small>CSS</small></td>
  </tr>
</table>
<hr>

# Table of Contents

- [Introduction](#introduction)
  - [Installation](#installation)
  - [How to Run the Application](#how-to-run-the-application)
  - [How Tagly Works](#how-tagly-works)
- [Third-Party Code and Libraries](#third-party-code-and-libraries)
- [Code and Organization](#code-and-organization)
- [Distinctiveness and Complexity](#distinctiveness-and-complexity)

---

# Introduction

**Tagly** is a bookmark management tool designed to help users organize, categorize, and access their bookmarks efficiently. With features like collections, favorites, and pagination, Tagly ensures a seamless experience for managing online resources.

This project was created as the **capstone project for CS50 Web Programming with Python and JavaScript**. It represents a culmination of the skills developed during the course, including implementing Django models, JavaScript interactivity, mobile responsiveness, and scalable database solutions.

---

## Installation

<details>
<summary>Step-by-step instructions</summary>

### 1. Clone the repository

```bash
git clone https://github.com/alihanayaz/tagly.git
cd tagly
```

### 2. Set up a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # For Linux/macOS
venv\Scripts\activate  # For Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure the `.env` file

Create a `.env` file in the root directory with the following content:

```env
SECRET_KEY='your-secret-key'
DEBUG=True  # Change to False in production
ALLOWED_HOSTS='127.0.0.1,0.0.0.0,localhost,.your-deployment-domain'
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=your_database_port
```

### 5. Set up the PostgreSQL database

Ensure the database credentials in your `.env` file are correct, then run:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create a superuser

```bash
python manage.py createsuperuser
```

### 7. Run the development server

```bash
python manage.py runserver
```

Access the application at `http://127.0.0.1:8000`.

### 8. Prepare for production (if `DEBUG=False`)

Run the following to collect static files:

```bash
python manage.py collectstatic
```

</details>

---

## How to Run the Application

Once the setup is complete, follow these steps:

1. Open a web browser and navigate to `http://127.0.0.1:8000`.
2. Create a new account or log in with the superuser credentials.
3. Use the interface to manage your bookmarks by adding, editing, deleting, and organizing them into collections.

---

## How Tagly Works

1. **User Authentication**:

   - Secure login and signup using Django's authentication system.
   - Custom user model to support both email and username for login.

2. **Bookmark Management**:

   - Create, edit, and delete bookmarks.
   - Organize bookmarks into user-defined collections.
   - Mark bookmarks as favorites for easy access.

3. **Responsive Design**:

   - Fully mobile-responsive layout for seamless use on all devices.

4. **Pagination**:
   - Paginate bookmarks and collections for improved usability and performance.

---

## Third-Party Code and Libraries

This project leverages the following libraries and frameworks:

- **[Django](https://www.djangoproject.com/):** Backend framework for handling models, views, and templates.
- **[PostgreSQL](https://www.postgresql.org/):** Relational database for storing user data.
- **[python-decouple](https://pypi.org/project/python-decouple/):** For environment variable management.
- **[psycopg](https://pypi.org/project/psycopg/):** PostgreSQL adapter for Python.
- **[asgiref](https://pypi.org/project/asgiref/):** For ASGI server support.
- **[sqlparse](https://pypi.org/project/sqlparse/):** Used for SQL formatting.
- **[typing-extensions](https://pypi.org/project/typing-extensions/):** Backport of type hinting features.
- **[whitenoise](https://pypi.org/project/whitenoise/):** For serving static files in production.

---

## Code and Organization

This section describes the structure of the project and provides details about every file included.

### Project Root Directory

- **README.md**: Documentation of the project, including installation steps, usage, and an explanation of the distinctiveness and complexity of the project.
- **requirements.txt**: Contains the list of Python dependencies needed for the project.
- **manage.py**: Django’s command-line utility for project management tasks like running the server and managing migrations.
- **templates/**: Contains shared HTML templates for the project.
- **static/**: Contains shared static files like CSS and JavaScript used across the entire project.
- **staticfiles/**: Automatically generated by Django when `collectstatic` is run; contains static files for production use.
- **tagly/**: Core Django project configuration folder.

### Inside `tagly/`

- **`__init__.py`**: Indicates that this directory is a Python package.
- **`asgi.py`**: Entry point for ASGI-compatible web servers to serve the project.
- **`settings.py`**: Contains all the settings and configurations for the Django project, including database settings, middleware, and installed apps.
- **`urls.py`**: Maps URLs to the corresponding views across the project.
- **`wsgi.py`**: Entry point for WSGI-compatible web servers to serve the project.

### Inside `accounts/`

Handles user authentication and custom user models.

- **`__init__.py`**: Indicates that this directory is a Python package.
- **`admin.py`**: Contains configurations for the Django admin interface for the `TaglyUser` model.
- **`apps.py`**: Contains configuration for the `accounts` app.
- **`backends.py`**: Implements a custom authentication backend allowing login with either username or email.
- **`forms.py`**: Contains forms for user authentication (e.g., login, signup).
- **`models.py`**: Defines the custom `TaglyUser` model.
- **`views.py`**: Contains views for login, logout, and signup functionality.
- **`urls.py`**: Maps URLs for user authentication views.
- **`migrations/`**: Stores migration files for the database changes related to the `accounts` app.
  - **0001_initial.py**: Initial migration for the `accounts` app.
  - **0002_taglyuser_delete_user.py**: Removes the default user model and adds `TaglyUser`.
  - **`__init__.py`**: Indicates that this directory is a Python package.
- **`static/`**: Contains app-specific static files.
  - **`styles/accounts/layout.css`**: Styles for user authentication pages.
- **`templates/accounts/`**: Contains templates specific to the `accounts` app.
  - **accounts-layout.html**: Base template for authentication pages.
  - **login.html**: Template for the login page.
  - **signup.html**: Template for the signup page.

### Inside `bookmarks/`

Manages bookmark and collection functionalities.

- **`__init__.py`**: Indicates that this directory is a Python package.
- **`admin.py`**: Configures the admin interface for `Bookmark` and `Collection` models.
- **`apps.py`**: Contains configuration for the `bookmarks` app.
- **`models.py`**: Defines the `Bookmark` and `Collection` models.
- **`views.py`**: Contains views for bookmark and collection CRUD operations, pagination, and AJAX-based interactions.
- **`urls.py`**: Maps URLs for bookmark and collection views.
- **`tests.py`**: Contains test cases for the `bookmarks` app.
- **`migrations/`**: Stores migration files for the database changes related to the `bookmarks` app.
  - **0001_initial.py**: Initial migration for the `bookmarks` app.
  - **0002_remove_bookmark_tags_remove_bookmark_description_and_more.py**: Updates the schema for bookmarks.
  - **`__init__.py`**: Indicates that this directory is a Python package.
- **`static/`**: Contains app-specific static files.
  - **`scripts/bookmarks/api.js`**: JavaScript file handling dynamic interactions for bookmarks and collections.
  - **`styles/bookmarks/layout.css`**: CSS for styling bookmark pages.
  - **`styles/bookmarks/welcome-layout.css`**: CSS for the welcome page.
- **`templates/bookmarks/`**: Contains templates specific to the `bookmarks` app.
  - **bookmarks-layout.html**: Base template for bookmark-related pages.
  - **index.html**: Template for the main bookmarks page.
  - **welcome.html**: Template for the welcome page for unauthenticated users.

### Shared Folders

- **`static/`**:
  - **styles/base.css**: Global CSS file for shared styles across the project.
- **`templates/`**:
  - **layout.html**: Base template used by all other templates to ensure consistent structure and design.

---

## Distinctiveness and Complexity

Tagly stands apart from other CS50W projects due to its unique feature set, advanced implementation, and focus on user-centric functionality. Below is an expanded explanation of how it meets the distinctiveness and complexity requirements:

### Distinctiveness

1. **Unique Application Domain**:

   - Tagly is a **bookmark management tool**, a domain not covered by any of the existing projects in CS50W. It provides functionalities beyond basic CRUD operations by introducing advanced features like favorites, collections, and categorization.
   - The concept of organizing bookmarks into collections, marking favorites, and accessing bookmarks efficiently is distinct and serves a practical real-world purpose.

2. **Interactive Front-End**:

   - Unlike other projects in the course, Tagly extensively uses **AJAX for real-time interactions**. All major actions (such as adding, editing, deleting, and toggling favorites) are processed asynchronously, making the app more responsive and user-friendly.

3. **Custom Authentication Backend**:

   - The authentication system allows users to log in using either their username or email address, demonstrating a deeper understanding of Django's extensibility.

4. **Professional Features**:
   - Features like server-side pagination, responsive design, and production-ready static file management (via `whitenoise`) make Tagly feel like a polished, real-world application.

### Complexity

1. **Advanced Back-End Logic**:

   - The **Django models** for `Bookmark` and `Collection` include advanced relationships, constraints, and custom fields. For example, bookmarks are tied to users and can optionally belong to collections. This introduces relational database management and foreign key handling.
   - The back-end includes **complex view logic** to support filtering, sorting, and paginating bookmarks dynamically.

2. **AJAX and JavaScript Integration**:

   - JavaScript is extensively used to provide a smooth user experience. Key functionalities include:
     - Dynamic loading of bookmarks without reloading the page.
     - Pagination controls that update content asynchronously.
     - Interactive modals for editing bookmarks and collections.

3. **Database Management with PostgreSQL**:

   - PostgreSQL was chosen for its robustness and scalability, demonstrating the ability to work with production-grade databases. The app uses a relational schema that ensures data integrity and efficient querying.

4. **Responsive Design**:

   - The application is fully mobile-responsive, ensuring compatibility across different devices. This required thoughtful CSS design and testing on multiple screen sizes.

5. **Production-Ready Static File Handling**:

   - The use of `whitenoise` for static file management demonstrates understanding of deployment requirements and Django's production capabilities.

6. **Error Handling and Edge Cases**:

   - Edge cases such as invalid form submissions, attempts to access unauthorized resources, and handling empty states (e.g., "No bookmarks found") are thoughtfully managed.

7. **Separation of Concerns**:
   - The front-end and back-end responsibilities are clearly delineated, with API endpoints serving as the bridge. The project structure adheres to the **Model-View-Controller (MVC)** pattern, ensuring maintainability and scalability.
