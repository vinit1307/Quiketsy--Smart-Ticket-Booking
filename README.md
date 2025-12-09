# Quiketsy--Smart-Ticket-Booking

A scalable, microservices-based web application for real-time event and service booking with smart queue management, AI-powered recommendations, Razorpay payment integration, and contactless QR-based ticketing.

---

## 📖 Table of Contents

- [About the Project](#about-the-project)  
- [Key Features](#key-features)  
- [System Architecture](#system-architecture)  
- [Tech Stack](#tech-stack)  
- [Database Design](#database-design)   
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Backend Setup](#backend-setup)  
  - [Frontend Setup](#frontend-setup)  
  - [Environment Variables](#environment-variables)  
- [Usage Guide](#usage-guide)  
- [AI Recommendation Engine](#ai-recommendation-engine)  
- [Smart Queue Management](#smart-queue-management)  
- [Payment Integration (Razorpay)](#payment-integration-razorpay)  
- [Testing](#testing)  
- [Folder Structure](#folder-structure)  
- [Future Enhancements](#future-enhancements)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)

---

## 🚀 About the Project

This project is a **real-time booking marketplace** designed to solve common issues in traditional booking platforms, such as overbooking, lack of personalization, poor queue handling, and absence of real-time updates. It enables users to browse events, receive personalized recommendations, book tickets, join smart queues when events are full, and receive instant notifications about their booking and queue status.

The system uses a **microservices architecture** with **Spring Boot** for core backend services, **FastAPI (Python)** for AI-based recommendations, and **React.js** for a responsive frontend. Payments are processed securely through **Razorpay**.

---

## ✨ Key Features

- User registration, authentication, and role-based access (User, Partner, Admin)  
- Event creation and management by partners/admins (with categories and images)  
- Event browsing, search, and filter by category, date, and location  
- AI-powered personalized recommendations based on user booking history  
- Real-time booking with instant availability updates  
- Smart queue management using loyalty points and join time  
- Contactless QR-code generation for each successful booking  
- QR verification at entry using scanners or mobile devices  
- Razorpay integration for secure online payments  
- Real-time notifications for booking, queue movement, and payment status  
- Booking and queue history dashboard for users  
- Admin and partner analytics for events and bookings  

---

## 🧩 System Architecture

The system follows a **client–server, microservices-based architecture**:

- **Client Side (Frontend)**:  
  - Built with React.js  
  - Communicates with backend via REST APIs
  - Handles UI, routing, and display of real-time updates

- **Server Side (Backend Services)**:  
  - Spring Boot microservices for user management, events, bookings, queues, and notifications  
  - FastAPI service for recommendation logic and AI model inference    
  - Razorpay payment integration for secure payment flows  
  - PostgreSQL as the main persistent data store

---

## 🛠 Tech Stack

**Frontend**  
- React.js  
- HTML5, CSS3, JavaScript

**Backend**  
- Java Spring Boot (REST APIs, business logic, microservices)  
- Python FastAPI (AI recommendation microservice)  

**Database and Storage**  
- PostgreSQL (primary database for Users, Events, Bookings, Queue, Notifications)  


**Payments**  
- Razorpay Payment Gateway (for online payments and transaction integration)  

**Development & Collaboration Tools**  
- Visual Studio Code / IntelliJ IDEA (IDEs)  
- Postman (API testing)  
- Draw.io, StarUML (DFDs, UML diagrams, architecture design)  
- Git (version control)  
- GitHub (remote repository, issues, pull requests, documentation)

---

## 🗂 Database Design

Core tables:

- **Users**: Stores user credentials, roles, points, and profile information  
- **Events**: Stores event details including title, description, category, location, schedule, available slots, and image URL  
- **Bookings**: Stores bookings with status, timestamps, QR codes, and user–event linkage  
- **Queue**: Stores queue entries with user, event, points, join time, and status  

The schema is normalized to reduce redundancy and designed to support fast queries for booking, queue ranking, and recommendations.

---

## 🧷 Getting Started

### Prerequisites

- Node.js and npm/yarn  
- Java 17+ and Maven/Gradle  
- Python 3.10+ and pip  
- PostgreSQL  
- Git  
- Razorpay test account (API key and secret)

### Backend Setup

1. Clone the repository:  
```bash
git clone https://github.com/vinit1307/Quiketsy--Smart-Ticket-Booking.git
cd Quiketsy--Smart-Ticket-Booking
```

2. Configure PostgreSQL and create a database (e.g., `booking_db`).

3. Update Spring Boot `application.properties` / `application.yml` with DB credentials and Razorpay keys.

4. Build and run the Spring Boot services:  
```bash
cd Quiketsy--Smart-Ticket-Booking/services/ticket-booking-system/
mvn clean install
mvn spring-boot:run
```

5. Setup and run FastAPI AI service:  
```bash
cd services/python-service
pip install -r requirements.txt
uvicorn main:app --reload
```


### Frontend Setup

1. Navigate to the frontend folder:  
```bash
cd client
```

2. Install dependencies:  
```bash
npm install
```

3. Start the development server:  
```bash
npm run dev
```

The frontend should now be accessible at `http://localhost:5173`.

### Environment Variables

Typical environment variables to include are demonstrated in .env.example.

---

## 📚 Usage Guide

- **User**:  
- Register → Login → Browse events → View details → Book tickets → Pay via Razorpay → Get QR code → View booking history.  
- Join queue when events are full and receive live notifications for slot availability.

- **Partner**:  
- Login → Create/update/delete events → View bookings for their events → Monitor analytics.

---

## 🤖 AI Recommendation Engine

The AI service analyzes user booking history and event categories to provide personalized event recommendations. It exposes REST endpoints consumed by the frontend to show suggested events on the dashboard. Over time, additional features such as collaborative filtering and content-based filtering can be added.

---

## 🧮 Smart Queue Management

When an event is fully booked, new interested users are placed into a smart queue. The queue ranks users based on loyalty points and the time at which they joined the queue. When tickets become available due to cancellations or capacity changes, the system automatically offers these slots to top-ranked users and notifies them in real time.

---

## 💳 Payment Integration (Razorpay)

The booking flow integrates Razorpay to handle payments securely. For paid events:

1. User initiates booking and selects Razorpay as the payment method.  
2. The backend creates a Razorpay order and redirects user to the payment interface.  
3. On payment completion, Razorpay sends a response which is verified by the backend.  
4. Booking is confirmed, recorded in the database, and a QR code is generated.  
5. User receives confirmation notifications and can access the booking from their dashboard.

---

## ✅ Testing

- Unit tests for backend services (Spring Boot and FastAPI).  
- Integration tests for REST APIs and database interactions.  
- Frontend tests using frameworks like Jest/React Testing Library (optional).  
- Manual and automated tests for payment flows using Razorpay test mode.

---

## 🗃 Folder Structure

Example high-level layout:
```bash
Quiketsy--Smart-Ticket-Booking/
├── client/
├── services/
│   ├── python-service/
│   └── ticket-booking-System/
├── .env.example
├── .gitignore
└── README.md

```

---

## 🔮 Future Enhancements

- User reviews and ratings for events  
- Advanced recommendation algorithms (collaborative filtering, hybrid methods)  
- Support for multiple payment gateways  
- Mobile app version (React Native / Flutter)  
- Multi-language support and accessibility improvements  

---

## 🤝 Contributing

Contributions are welcome!  

1. Fork the repository  
2. Create a new branch (`feature/your-feature-name`)  
3. Commit your changes with clear messages  
4. Push to your fork and open a Pull Request  

Please open an issue for bug reports or feature requests.

---

## 📄 License

This project is intended as an academic/portfolio project.  
You may adapt and reuse it for learning and personal use.

---

## 📬 Contact

- Author:
  Vivek Patel @vivekkkpatel
  Vinit Malwe @vinit1307
  Yashraj Tilwani @yashrajtilwani
  Vidhan Tayade @Vidhan-Tayade
  
- Email: quiketsyticketbooking@gmail.com

Feel free to open an issue or reach out for queries, suggestions, or collaboration.
