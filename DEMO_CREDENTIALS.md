# 🚀 Demo Account Credentials

This file contains credentials for the Progress LMS Demo School (Al-Noor Islamic Academy) populated with 10 teachers and 25 students with authentic Islamic names.

## 🌍 Environment Setup

### Local Development
- Database: MySQL (local)
- Seed Script: `backend/seed-islamic-school.js` (already executed ✅)
- Status: **Ready** - All data seeded

### Vercel Production
- Database: MySQL at Hostinger (srv2027.hstgr.io:3306)
- Seed Endpoint: `POST /api/seed`
- Status: **Requires seeding** - Run command below first

#### Seed Remote Database (Vercel)

The remote database needs to be seeded once. Add `SEED_SECRET` to Vercel environment variables, then call:

```bash
curl -X POST https://progresslms-backend.vercel.app/api/seed \
  -H "Authorization: Bearer YOUR_SEED_SECRET" \
  -H "Content-Type: application/json"
```

---

## 🔐 Superadmin (Central Authority)

| Property | Value |
|----------|-------|
| **Email** | `SA@progresslms.com` |
| **Password** | `Superpass` |
| **Role** | System Administrator |
| **Access** | All schools, all users, system settings |

---

## 🏫 School: Al-Noor Islamic Academy

### Admin Login

| Property | Value |
|----------|-------|
| **Name** | Dr. Muhammad Rashid |
| **Email** | `admin@alnoor-academy.edu` |
| **Password** | `admin123` |
| **Role** | School Administrator |

---

## 👨‍🏫 Teachers (10 Total)

All teachers use password: **`password123`**

| Name | Email | Subject |
|------|-------|---------|
| Muhammad Hassan Al-Rashid | `hassan.rashid@islamic-school.edu` | Quranic Studies |
| Fatima Zahra Ahmed | `fatima.ahmed@islamic-school.edu` | Islamic History |
| Ali ibn Omar | `ali.omar@islamic-school.edu` | Mathematics |
| Aisha Malik Khan | `aisha.khan@islamic-school.edu` | Arabic Language |
| Ibrahim Abdullah | `ibrahim.abdullah@islamic-school.edu` | Science |
| Zainab Hussain | `zainab.hussain@islamic-school.edu` | English Literature |
| Yousuf Rahman | `yousuf.rahman@islamic-school.edu` | Islamic Ethics |
| Leila Nasrallah | `leila.nasrallah@islamic-school.edu` | Geography |
| Khalid Al-Mansouri | `khalid.mansouri@islamic-school.edu` | Physical Education |
| Noor Salim | `noor.salim@islamic-school.edu` | Computer Science |

---

## 🎓 Students (25 Total)

All students use password: **`password123`**

**Grade 1:**
- Amr Abdullah (`amr.abdullah@islamic-school.edu`)
- Layla Hassan (`layla.hassan@islamic-school.edu`)
- Tariq Ahmed (`tariq.ahmed@islamic-school.edu`)
- Hana Ibrahim (`hana.ibrahim@islamic-school.edu`)
- Karim Malik (`karim.malik@islamic-school.edu`)

**Grade 2:**
- Nadia Rahman (`nadia.rahman@islamic-school.edu`)
- Bilal Khan (`bilal.khan@islamic-school.edu`)
- Maryam Ali (`maryam.ali@islamic-school.edu`)
- Samir Nasri (`samir.nasri@islamic-school.edu`)
- Rania Hassan (`rania.hassan@islamic-school.edu`)

**Grade 3:**
- Omar Ibrahim (`omar.ibrahim@islamic-school.edu`)
- Samira Abdullah (`samira.abdullah@islamic-school.edu`)
- Zayn Ahmed (`zayn.ahmed@islamic-school.edu`)
- Farah Malik (`farah.malik@islamic-school.edu`)
- Hassan Al-Rashid (`hassan.alrashid@islamic-school.edu`)

**Grade 4:**
- Yasmin Khan (`yasmin.khan@islamic-school.edu`)
- Mustafa Rahman (`mustafa.rahman@islamic-school.edu`)
- Dina Hassan (`dina.hassan@islamic-school.edu`)
- Adnan Ahmed (`adnan.ahmed@islamic-school.edu`)
- Sara Ali (`sara.ali@islamic-school.edu`)

**Grade 5:**
- Waleed Ibrahim (`waleed.ibrahim@islamic-school.edu`)
- Huda Nasrallah (`huda.nasrallah@islamic-school.edu`)
- Rashid Malik (`rashid.malik@islamic-school.edu`)
- Lina Abdullah (`lina.abdullah@islamic-school.edu`)
- Sami Khan (`sami.khan@islamic-school.edu`)

---

## 🔧 Quick Test Commands

```bash
# Test Admin Login
curl -X POST http://localhost:5000/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@alnoor-academy.edu", "password": "admin123"}'

# Test Teacher Login
curl -X POST http://localhost:5000/api/v1/auth/teacher/login \
  -H "Content-Type: application/json" \
  -d '{"email": "hassan.rashid@islamic-school.edu", "password": "password123"}'

# Test Student Login
curl -X POST http://localhost:5000/api/v1/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"email": "amr.abdullah@islamic-school.edu", "password": "password123"}'
```

---

## ✅ Troubleshooting

### Vercel: 401 Errors on Login
**Cause:** Remote database not seeded

**Fix:** Call the seed endpoint once:
```bash
curl -X POST https://progresslms-backend.vercel.app/api/seed \
  -H "Authorization: Bearer SEED_SECRET_VALUE"
```

### Incorrect Password Error
- Teachers & Students: `password123`
- Admin: `admin123`
- Superadmin: `Superpass`

All passwords are **case-sensitive**.
