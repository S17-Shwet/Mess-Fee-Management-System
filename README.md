📌 Mess Fee Management System

A web-based Mess Fee Management System built using HTML, CSS, JavaScript, and Firebase.
This system allows students to upload their mess fee payment details and enables the mess manager to monitor and verify transactions digitally.

🌐 Live Demo

🔗 Live Project Link:
👉 https://mess-fee-management-system.vercel.app/


🚀 Features
👩‍🎓 Student Features

Register with Name, Roll No / Phone, Password

Secure login using Firebase Authentication

Submit mess fee details:

PRN Number

Email

Phone

Start Date & End Date

Amount

Google Pay Transaction ID

Screenshot upload (Max 500KB)

Duplicate payment prevention (Same GPay ID not allowed)

View previously submitted records

👨‍💼 Manager Features

Only one manager account allowed

Role-based login authentication

View all student payment records

Search payments by:

PRN

Roll No / Phone

View uploaded payment screenshots

🛠 Technologies Used

HTML5

CSS3

JavaScript (ES6 Modules)

Firebase Authentication

Firebase Realtime Database

Firebase Storage

🔐 Authentication & Data Handling

Email & Password Authentication (Firebase)

Role-based access control (Student / Manager)

Secure data storage using Realtime Database

Base64 image storage for payment proof

Input validation & duplicate record prevention

📂 Project Structure
Mess-Fee-Management-System/
│
├── index.html
├── style.css
├── script.js
├── firebase.js
└── README.md

⚙️ How To Run Locally

Clone the repository:

git clone https://github.com/S17-Shwet/Mess-Fee-Maagement-System.git


Open project folder in VS Code

Configure Firebase:

Create project in Firebase Console

Enable Authentication (Email/Password)

Enable Realtime Database

Enable Storage

Add your Firebase config inside firebase.js

Run using Live Server extension (VS Code)

🔥 Future Enhancements

Admin approval system

Payment status tracking (Approved / Pending)

Download payment receipt

Improved UI/UX design

Deploy fully using Firebase Hosting

Add analytics dashboard

🎯 Objective

This project digitizes mess fee management by:

Reducing manual paperwork

Increasing transparency

Preventing duplicate entries

Making record tracking easy for both students and manager

👩‍💻 Developed By

Shweta Nichal
Engineering Student | Aspiring Software Professional
