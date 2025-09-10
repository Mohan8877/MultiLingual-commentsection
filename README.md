# 🌐 Multilingual Comment Section  

A real-time, multilingual comment system built with **Next.js (TypeScript)**, **MongoDB Atlas**, and **Socket.io**.  
This project allows users to post comments with **location detection**, **live updates**, and **translation support** for multiple Indian and global languages.  

---

## ✨ Features  
- 📝 **Post Comments** with username and content  
- 📍 **Location Detection** using IP-based geolocation (via [ipinfo.io](https://ipinfo.io))  
- 🔄 **Real-time updates** using Socket.io  
- 👍👎 **Like / Dislike system** with user-based tracking  
- 🌍 **Multilingual Translation** (English, Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Urdu, Odia, Assamese, Kashmiri, Maithili, Sindhi, Sanskrit, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, etc.)  
- 🕒 **Timestamped comments** (auto-formatted date & time)  
- ⚡ **Deployed on Vercel** for seamless access  

---

## 🏗️ Tech Stack  
- **Frontend:** Next.js (TypeScript), React, TailwindCSS, ShadCN UI  
- **Backend:** Next.js API Routes, TypeScript  
- **Database:** MongoDB Atlas  
- **Real-time:** Socket.io  
- **Geolocation:** [ipinfo.io API](https://ipinfo.io)  
- **Deployment:** Vercel  

---

## 📂 Project Structure  
├── app/
│ ├── api/
│ │ ├── comments/ # Comment APIs (GET, POST, Like, Dislike)
│ │ ├── translate/ # Translation API
│ ├── components/
│ │ ├── comment-card.tsx # UI for displaying comments
│ │ ├── comment-avatar.tsx
├── lib/
│ ├── database-operations.ts
│ ├── models/comment.ts
│ ├── socket-emitter.ts
│ ├── ip-utils.ts
├── README.md

yaml
Copy code

---

## 🚀 Getting Started  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/Mohan8877/MultiLingual-commentsection.git
cd MultiLingual-commentsection
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Setup Environment Variables
Create a .env.local file in the root folder:

env
Copy code
MONGODB_URI=your_mongodb_atlas_connection_string
IPINFO_API_KEY=your_ipinfo_api_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
4️⃣ Run Locally
bash
Copy code
npm run dev
Your app will be running on 👉 http://localhost:3000

🌍 Deployment (Vercel)
Push your project to GitHub

Import the repo into Vercel

Add environment variables (MONGODB_URI, IPINFO_API_KEY) in Vercel settings

Deploy 🎉

📸 Screenshots
💬 Comment Card with Location
(username, comment, city & country)

🌍 Translate Feature
(users can translate comments into multiple languages)

🛠️ Contributing
Contributions are welcome!

Fork the repo

Create a new branch (feature/your-feature)

Commit changes

Push and open a PR

📜 License
MIT License © 2025 Mohan8877

