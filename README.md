# 🩸 BloodCon – A MERN Stack Blood Donation App

## 📖 Description

**BloodCon** is a full-stack web application that connects blood donors and recipients. Users can register, view donors by blood group, submit blood requests, and donate. Admins can manage users. This app aims to make the blood donation process more transparent and accessible.

---

## 🚀 Features

- 🔐 User Authentication (Register/Login via JWT)
- 👤 View Donor Profiles with Public Email & Phone
- 📥 Blood Request System with Accept Function
- 💉 Donation Record Submission & History Tracking
- 🧑‍💻 Admin Panel for Managing Users
- 🌐 RESTful API (Node.js & Express)
- 📱 Responsive UI built with React.js
- 💾 MongoDB Integration with Mongoose

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Axios, Tailwind CSS / Bootstrap  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT  
- **Hosting:** Render / Vercel / Netlify *(update as applicable)*

---

## 🔗 Live Demo

[🚀 Visit Live App](https://your-demo-link.com)  
*(Replace with actual deployment link)*

---

## 🖥️ Screenshots *(Optional)*

> _Add screenshots here if available (UI, Donor Cards, Forms, Admin Panel, etc.)_

---

## 📂 Installation Instructions

### 🔧 Backend Setup

```bash
git clone https://github.com/ashique01/BloodCon-MERN.git
cd BloodCon-MERN/backend
npm install
````

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Then start the backend:

```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

---

### 💻 Frontend Setup

In a new terminal tab:

```bash
cd BloodCon-MERN/frontend
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 📡 API Endpoints Overview

### 👤 Users

* `POST /api/users/register` – Register user
* `POST /api/users/login` – Login
* `GET /api/users/profile` – Get profile
* `GET /api/users/:id` – Get donor by ID (includes email & phone)

### 📥 Blood Requests

* `POST /api/requests/` – Create request
* `GET /api/requests/` – All requests
* `PUT /api/requests/:id/accept` – Accept a request

### 💉 Donations

* `POST /api/donations/` – Submit donation
* `GET /api/donations/` – View donation history

### 🔒 Admin

* `GET /api/admin/users` – List users
* `DELETE /api/admin/users/:id` – Remove user

---

## 💬 Contact

**Developer:** Ashique Murad
📧 Email: [ashiquemurad@gmail.com](mailto:ashiquemurad@gmail.com)
🌐 GitHub: [Ashique01](https://github.com/Ashique01)

---

## 📜 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute.

---

## 📢 Contributing

Feel free to fork the repo, open issues, or submit pull requests. Contributions are welcome!

```
