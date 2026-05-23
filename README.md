# 🦷 Anjum Dentist — Premium Dental Website

A full-stack, ultra-premium dental clinic website built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Lucide React**, and **MongoDB (Mongoose)**.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/anjum-dentist

# JWT secret (any long random string)
JWT_SECRET=your-super-secret-key-here

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📋 Pages & Features

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, Stats, Services, About, Testimonials, Appointment Form, Contact |
| Services | `/services` | Full services showcase with booking |
| About | `/about` | Clinic story, team, stats, testimonials |
| Contact | `/contact` | Contact form, WhatsApp, clinic details |
| Admin Login | `/admin/login` | Secure login (default: `admin` / `admin123`) |
| Admin Dashboard | `/admin/dashboard` | Appointment manager + site settings |

---

## 🔧 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/appointments` | Book new appointment |
| `GET` | `/api/appointments` | Fetch all appointments |
| `PATCH` | `/api/appointments/[id]` | Update appointment status |
| `DELETE` | `/api/appointments/[id]` | Delete appointment |
| `GET` | `/api/settings` | Fetch site settings |
| `PUT` | `/api/settings` | Update site settings |
| `POST` | `/api/auth/login` | Admin login |
| `POST` | `/api/auth/logout` | Admin logout |

---

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Database**: MongoDB via Mongoose
- **Auth**: JWT (via `jose`, Edge-compatible)
- **Notifications**: react-hot-toast

---

## 🛠️ MongoDB Setup (Free Tier)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and create a free account
2. Create a free M0 cluster
3. Create a database user under **Security → Database Access**
4. Allow network access under **Security → Network Access** (add `0.0.0.0/0` for dev)
5. Click **Connect → Drivers** and copy the connection string
6. Replace `<password>` with your database user's password and paste into `MONGODB_URI`

---

## 🔐 Default Admin Credentials

```
Username: admin
Password: admin123
```

> **Change these in `.env.local` before deploying to production!**

---

## 📦 Build for Production

```bash
npm run build
npm start
```
