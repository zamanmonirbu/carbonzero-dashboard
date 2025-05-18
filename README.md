# 🧠 Full-Stack Consultation Platform

A full-stack consultation platform where different companies can register by paying an entry fee and get their own dashboard. Each company receives a one-month free trial. After that, they must subscribe to continue accessing services like blog viewing and company-related information. Users can book email or video consultations. Includes role-based panels for Users, Admins, and Super Admins.

🔗 **Live Site:** [https://carbonzero-ochre.vercel.app](https://carbonzero-ochre.vercel.app)


🔗 **Live Dashboard:** [https://carbonzero-dashboard.vercel.app](https://carbonzero-dashboard.vercel.app)


---

## 🚀 Features

### 🔐 Authentication & Authorization
- Login/signup with secure JWT tokens
- Role-based access for:
  - 👤 Users
  - 🛠 Admins
  - 👑 Super Admins

### 🏢 Company Services
- One-month free trial
- Subscription after trial
- Dashboard access with company-related info
- Blog viewing

### 👥 User Services
- Book:
  - ✉️ Email consultations (paid)
  - 🎥 1-hour video consultations (paid)
- View:
  - Company details
  - Blogs
  - Notifications
  - Subscription history

### 🛠 Admin & Super Admin Panel
- **Admin**: Manage company content, user consultations, and blogs
- **Super Admin**: Full system control including company approvals, subscription status, user roles

---

*Client Site Code:* https://github.com/zamanmonirbu/carbonzero.git

*Dashboard code:* https://github.com/zamanmonirbu/carbonzero-dashboard.git

*Backend code:* https://github.com/zamanmonirbu/carbonzero-backend.git


## 🧪 Test Credentials

| Role         | Email                  | Password   |
|--------------|------------------------|------------|
| User         | user@gmail.com         | 12345678   |
| Admin        | admin@gmail.com        | 12345678   |
| Super Admin  | superadmin@gmail.com   | 12345678   |

---

## 💻 Tech Stack

| Frontend  | Backend     | Database | Others |
|-----------|-------------|----------|--------|
| Next.js  | Node.js     | MongoDB  | Stripe (Payments) |
| Tailwind  | Express.js  | Mongoose | JWT, Role Auth     |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/zamanmonirbu/carbonzero-dashboard.git
cd carbonzero-dashboard

#packages install
npm install

#Run the project
npm run dev
