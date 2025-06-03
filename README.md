# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Master Dashboard (Frontend)

## 📌 Purpose and Goals

The **Master Dashboard (MD)** is a centralized admin panel designed to manage B2B companies, their users, ticket support, transactions, commission configurations, and detailed credit tracking related to flight bookings. It allows the admin to monitor revenue, recent bookings, and control access roles efficiently.

---

## ⚙️ Architecture Overview

The frontend is built using **Vite + React** with the **Redux Toolkit** for state management. It follows a modular and maintainable architecture suitable for scalable enterprise dashboards.

---

## 🧱 Technology Stack

* **React 18** (with Vite for blazing fast builds)
* **Redux Toolkit** (State Management)
* **Tailwind CSS** (Styling)
* **Socket.IO** (Live support chat)
* **Framer Motion** (Animations)
* **Axios** (HTTP Requests)
* **React Router v7** (Routing)
* **Formik & Yup** (Form management and validation)
* **jsPDF & html2canvas** (PDF generation)
* **Redux Persist** (Persist specific states)

---

## 📁 Folder Structure

```
src/
├── assets/             # Images, logos, banners
├── components/         # Global reusable components
├── core/
│   ├── features/       # Redux slices using createAsyncThunk
│   ├── rootReducer.js  # Root reducer for combining and persisting reducers
│   └── store.js        # Redux store configuration
├── data/               # Sidebar items and route data
├── hooks/              # Custom reusable hooks
├── layout/             # Layout wrapper (e.g., layout.jsx)
├── pages/              # All route-based page components
├── helper/             # Utility/helper functions
```

---

## 📑 Key Pages & Their Purpose

### 🏠 Dashboard

* Shows recent **flight bookings**, **revenue**, **total users**, **transactions**, **tickets**, **commissions**, and both types of **credits** (Iran credits & issued credits).

### 💳 Transactions Page

* B2B companies can **request credits** from the Master Dashboard by creating new transactions.
* Displays all past requests categorized as **Pending**, **Accepted**, or **Rejected**.

### 🎫 Tickets Page

* B2B users can create **support tickets**.
* Admin can view and respond via **live chat**.
* Tickets remain open until manually closed by the admin.

### 👥 Users Page

* Admin can view **B2B companies**, their users, and assign them **roles & permissions** for specific pages/features.

### ⚙️ Settings Page

* Profile management and personal settings for admin.

---

## 💼 Commission Scenario (In Detail)

* Every flight ticket displayed on B2B contains a **commission** set by MD (Master Dashboard).
* These commissions can be **increased or decreased** by the admin.
* Commission changes affect the **price shown to B2B** users.
* Admin can update these values in real-time via the Commission module.

---

## 💰 Credits Management Scenario (In Detail)

* **Two types of credits** are visible:

  * **Iran Credits** (shown in header): Purchased from the IRAN API, automatically reduced upon successful booking.
  * **Issued Credits** (shown on the dashboard home): These are the credits distributed to B2B companies manually after admin approval.

* ⚠️ There is **no API access to directly update real (Iran) credits**, hence the two-level credit tracking logic.

---

## 🔌 Socket.IO Support

* Implemented for **real-time ticket chat** between MD admin and B2B users.

---

## 📦 Notable Dependencies

```json
"@reduxjs/toolkit": "^2.6.1",
"axios": "^1.7.7",
"dayjs": "^1.11.13",
"framer-motion": "^11.13.3",
"formik": "^2.4.6",
"html2canvas": "^1.4.1",
"jspdf": "^3.0.0",
"react-data-table-component": "^7.7.0",
"react-icons": "^5.3.0",
"react-redux": "^9.2.0",
"react-router-dom": "^7.1.1",
"redux-persist": "^6.0.0",
"socket.io-client": "^4.x.x",
"tailwindcss": "^3.4.15",
"vite": "^5.4.10"
```

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js (LTS)

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🧪 Testing

* ❌ No Unit Testing has been implemented yet.

---

## 🚀 Deployment

* Hosted and deployed on **AWS EC2**

---

## ✅ Code Style & Best Practices

* Follows **CamelCase** for file and variable naming.
* **Prettier** is used for code formatting.
* Modular and scalable folder organization.

---

## 📞 Need Help?

For any queries, connect with the backend team or refer to the Admin API documentation available inside the backend codebase.

---

> *This frontend dashboard works in close coordination with the NestJS-powered backend APIs divided under Admin, B2B, and B2C layers.*

