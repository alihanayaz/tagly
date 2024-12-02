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
  - [How Tagly works](#how-tagly-works)
- [Code and organization](#code-and-organization)
  - [The project folder: tagly](#the-project-folder-tagly)
  - [The App folders: accounts and bookmarks](#the-app-folders-accounts-and-bookmarks)
  - [The static folder](#the-static-folder)
  - [Templates](#templates)
  - [Third-party code](#third-party-code)
- [About and license](#about-and-license)
- [Distinctiveness and complexity](#distinctiveness-and-complexity)

# Introduction

Tagly is a bookmark management tool designed to help users organize, categorize, and access their bookmarks efficiently. With features like collections, favorites, and pagination, Tagly ensures a seamless experience for managing online resources.

Developed as the **CS50W capstone project**, Tagly represents a significant effort in building a user-centric and feature-rich web application. It is tailored to demonstrate advanced web development practices, including robust backend logic, clean user interface design, and seamless interactivity.

## Installation

<details>
   <summary>1. Clone this repository</summary>

> ```bash
> git clone https://github.com/alihanayaz/tagly.git
> cd tagly
> ```

</details>

<details>
   <summary>2. Set up a virtual environment</summary>

> ```bash
> python -m venv venv
> source venv/bin/activate  # For Linux/macOS
> venv\Scripts\activate  # For Windows
> ```

</details>

<details>
   <summary>3. Install dependencies</summary>

> ```bash
> pip install -r requirements.txt
> ```

</details>

<details>
   <summary>4. Configure the .env file</summary>

> Create a `.env` file in the root directory with the following content:
>
> ```env
> SECRET_KEY='your-secret-key'
> DEBUG=True  # Change to False in production
> ALLOWED_HOSTS='127.0.0.1,0.0.0.0,localhost,.your-deployment-domain'
> DB_NAME=your_database_name
> DB_USER=your_database_user
> DB_PASSWORD=your_database_password
> DB_HOST=your_database_host
> DB_PORT=your_database_port
> ```
>
> Ensure to replace placeholder values with your actual credentials.

</details>

<details>
   <summary>5. Set up PostgreSQL database</summary>

> Update the `settings.py` file with your database credentials or ensure your `.env` file is correctly configured as shown above. Then, run the following commands:
>
> ```bash
> python manage.py makemigrations
> python manage.py migrate
> ```

</details>

<details>
   <summary>6. Create a superuser</summary>

> ```bash
> python manage.py createsuperuser
> ```

</details>

<details>
   <summary>7. Run the development server</summary>

> ```bash
> python manage.py runserver
> ```
>
> Access the app at `http://127.0.0.1:8000`.

</details>

<details>
   <summary>8. Collect static files (for production)</summary>

> If `DEBUG` is set to `False`, you must run the following command to collect static files:
>
> ```bash
> python manage.py collectstatic
> ```
>
> This step is essential for the project to work in a production environment.

</details>

## How Tagly works

1. **User Authentication**:

   - Sign up or log in using username or email.
   - Manage sessions securely with Django's authentication system.

2. **Bookmark Management**:

   - Create, edit, and delete bookmarks.
   - Organize bookmarks into collections.
   - Mark bookmarks as favorites for quick access.

3. **Responsive Design**:

   - Mobile-friendly interface for seamless access on all devices.

4. **Pagination**:

   - Navigate through bookmarks and collections with ease, thanks to the pagination feature.

# Code and organization

## The project folder: tagly

The root directory contains Django project configurations, including `settings.py`, `urls.py`, and `wsgi.py`. These files are standard for a Django project, with `settings.py` tailored for PostgreSQL and environment variable management using `decouple`. The `.env.example` file provides an example configuration for required environment variables.

## The App folders: accounts and bookmarks

### **1. accounts**

Handles user authentication and custom user models:

- Custom user model `TaglyUser` with fields for username, email, and more.
- Supports login using either username or email via a custom authentication backend.
- Views for login, signup, and logout functionalities.

### **2. bookmarks**

Core functionality for bookmark management:

- Models for `Bookmark` and `Collection`.
- Views for CRUD operations on bookmarks and collections.
- Pagination and filtering features to enhance user experience.
- Integration with AJAX for dynamic updates.

## The static folder

Static assets include:

- CSS: Responsive styles in `static/styles`.
- JavaScript: Event listeners, AJAX calls, and dynamic content management in `static/scripts`.

Additionally, there are static folders in each app (`accounts/static` and `bookmarks/static`) and a shared `static` folder in the root for common assets.

## Templates

Templates are organized under each app folder. Shared layouts like `layout.html` ensure consistent design, while app-specific templates handle unique functionalities. The root `templates` folder also includes shared templates for common use across the project.

## Third-party code

This project leverages the following third-party libraries and tools:

- [Django](https://www.djangoproject.com/): Backend framework.
- [PostgreSQL](https://www.postgresql.org/): Database management.
- [python-decouple](https://pypi.org/project/python-decouple/): For managing environment variables.
- [psycopg](https://pypi.org/project/psycopg/): PostgreSQL adapter for Python.
- [asgiref](https://pypi.org/project/asgiref/): For ASGI server functionality.
- [sqlparse](https://pypi.org/project/sqlparse/): Used for SQL formatting.
- [typing-extensions](https://pypi.org/project/typing-extensions/): Backport of type hinting features.
- [whitenoise](https://pypi.org/project/whitenoise/): For serving static files in production.

# About and license

Tagly was developed as the **capstone project for CS50 Web Programming with Python and JavaScript**. It adheres to the course’s guidelines for distinctiveness and complexity.

# Distinctiveness and complexity

Tagly stands out from other projects due to its unique combination of features and implementation:

- **Distinctiveness**:

  - While many projects focus on e-commerce, blogs, or basic data display, Tagly offers a robust solution for bookmark management, which is distinct in both purpose and functionality.
  - Features like collections, favorites, and real-time interactivity elevate its usability.
  - The project is designed with scalability and performance in mind, leveraging PostgreSQL for efficient data handling.

- **Complexity**:
  - Custom user model and authentication backend for a seamless user experience.
  - Advanced bookmark features implemented with a combination of Django views and AJAX for dynamic updates.
  - Responsive and clean UI built with modular CSS and JavaScript components.
  - Utilization of PostgreSQL, a powerful relational database system, for scalable and secure data storage.
  - Production-ready configurations with static file management using `whitenoise` and environment variable support.
  - Modular structure with centralized and app-specific static and template directories for maintainability.
  - Pagination logic to enhance user experience when navigating large datasets.
