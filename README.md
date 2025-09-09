🌍 MultiLingual Comment Section

A Next.js + TypeScript multilingual comment system that allows users to post comments in multiple languages, with automatic location detection (city, country) and MongoDB Atlas database storage. The app is fully deployed on Vercel.

✨ Features

📝 Post comments in multiple languages.

🌐 Auto-detects the user's location (city, country) via IP geolocation using IPinfo.io
.

💾 Stores comments securely in MongoDB Atlas.

🎨 Built with Next.js + TypeScript for reliability and maintainability.

🔒 Environment variables for secure API and DB credentials.

🚀 Deployed on Vercel with CI/CD integration.

🛠️ Tech Stack

Frontend: Next.js (React + TypeScript)

Styling: Tailwind CSS

Database: MongoDB Atlas

Backend: Next.js API routes (TypeScript)

Deployment: Vercel

Geolocation: IPinfo.io API

⚙️ Installation
1. Clone the Repository
git clone https://github.com/Mohan8877/MultiLingual-commentsection.git
cd MultiLingual-commentsection

2. Install Dependencies
npm install
# or
yarn install

3. Setup Environment Variables

Create a .env.local file in the root directory:

MONGODB_URI=your_mongodb_atlas_connection_string
NEXT_PUBLIC_IPINFO_API_KEY=your_ipinfo_api_key_here


👉 You can get your connection string from MongoDB Atlas
 and free IP key from IPinfo.io
.

4. Run the Development Server
npm run dev
# or
yarn dev


Now open 👉 http://localhost:3000

🌍 Deployment on Vercel

Push your repo to GitHub.

Go to Vercel
, import the repo.

Add the environment variables in Vercel Dashboard → Project → Settings → Environment Variables:

MONGODB_URI=your_mongodb_atlas_connection_string

NEXT_PUBLIC_IPINFO_API_KEY=your_ipinfo_api_key_here

Deploy 🚀

📌 API Usage

The backend fetches the user’s IP address and resolves it to location using IPinfo API.

Example API response:

{
  "ip": "103.120.xxx.xxx",
  "city": "Chittoor",
  "region": "Andhra Pradesh",
  "country": "IN"
}


The comment card will display:
Mohan • Chittoor, India

📂 Project Structure
├── lib/
│   ├── db.ts            # MongoDB connection helper
│   ├── ip-utils.ts      # IP geolocation utility
├── pages/
│   ├── api/
│   │   └── comments.ts  # API route for fetching/saving comments
│   ├── index.tsx        # Main UI
├── components/
│   ├── CommentForm.tsx
│   ├── CommentList.tsx
├── .env.local           # Environment variables
├── tsconfig.json        # TypeScript config
└── tailwind.config.js   # Tailwind CSS config

📸 Screenshots
Comment Form

Comment List


🤝 Contributing

Pull requests are welcome! Please open an issue for feature requests or bug reports.

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Mohan – GitHub
