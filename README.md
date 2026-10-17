# 🏆 Inter-Department Sports Management System

A full-stack web application developed as a collaborative hackathon project to support sports activities and coordination between college departments.

## 📌 About the Project

The Inter-Department Sports Management System provides a centralized platform for college sports activities. It includes authentication and sports-related pages designed to support event organization, team coordination, and access to sports information.

## ✨ Features

- User registration and login
- JWT-based authentication
- Team management pages
- Sports schedules and results pages
- Tournament brackets
- Announcements
- Admin and captain dashboards
- Volunteer-related functionality

*Feature availability depends on the implementation and backend integration.*

## 🛠️ Technologies Used

**Frontend**
- React
- Vite
- JavaScript
- CSS and Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose

**Authentication**
- JSON Web Tokens (JWT)
- bcryptjs

## 📁 Project Structure

```text
inter-department-sports/
├── client/       # React frontend
├── server/       # Express backend
├── package.json
└── README.md
```

## 🚀 Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB Atlas account or a supported MongoDB deployment

### 1. Clone the repository

```bash
git clone https://github.com/priya170523/inter-department-sports.git
cd inter-department-sports
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server/` folder and configure the required values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

Replace the example values with your own configuration. Never upload real passwords, tokens, or `.env` files to GitHub.

### 5. Start the backend

From the `server/` directory:

```bash
npm start
```

### 6. Start the frontend

From the `client/` directory, in a separate terminal:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 👥 Team and Hackathon

This project was developed collaboratively as part of a hackathon.

Add the hackathon name, team members, and their contributions here.

## 🔮 Future Enhancements

- Live score updates
- Improved event scheduling
- Automated notifications
- Enhanced team and player management
- Sports analytics and reports

## 🔐 Security

Never commit environment files or credentials. Configure database access permissions and use strong secrets for authentication.

## 📄 License

Add a license only after confirming that the project team has agreed to its terms.
