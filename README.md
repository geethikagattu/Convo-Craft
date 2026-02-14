# ConvoCraft 💬

**AI-Powered Conversation Starter Platform**

ConvoCraft helps you start better conversations with AI-generated icebreakers, reply suggestions, and practice chat features. Perfect for introverts, professionals, and anyone looking to improve their conversation skills.

![ConvoCraft Banner](https://via.placeholder.com/1200x400/4F46E5/ffffff?text=ConvoCraft+-+Start+Better+Conversations)

---

## 🌟 Features

### 🎯 Smart Icebreaker Generator
- Generate context-aware conversation starters
- Choose from 10+ situations (College, Office, Dating, Gym, etc.)
- Select personality style (Introvert, Extrovert, Ambivert, Funny, Calm)
- Get 3 unique icebreakers instantly

### 💡 Reply Suggestions
- Get intelligent follow-up suggestions
- Empathetic response options
- Light humor alternatives
- Natural conversation flow guidance

### 🤖 Practice Chat
- Chat with AI to practice conversations
- Real-time conversation scoring
- Track your confidence, empathy, and curiosity
- Build conversation skills in a safe environment

### 👤 User Authentication
- Secure signup and login
- Password reset functionality
- Conversation history tracking
- JWT-based authentication

### 🎨 Beautiful UI/UX
- Responsive design for all devices
- Dark/Light mode toggle
- Smooth animations and transitions
- Immersive hero section with background slideshow

---

## 🚀 Tech Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling & animations
- **Vanilla JavaScript** - Client-side logic
- **LocalStorage** - Session management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JSON File Database** - Data persistence
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication tokens

### AI/API
- **Google Gemini 2.0 Flash** - AI conversation generation
- **RESTful API** - Backend endpoints

---

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **Google Gemini API Key** ([Get it here](https://aistudio.google.com/app/apikey))

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/geethikagattu/Convo-Craft.git
cd Convo-Craft
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
JWT_SECRET=your_random_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5001
```

**To generate a secure JWT_SECRET:**
```bash
openssl rand -base64 32
```

**To get Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it into `.env`

### 4. Start the Backend Server

```bash
node server.js
```

You should see:
```
📁 Database file: .../backend/db.json
📊 Current users: 0
✅ Database ready!
🚀 Server running on port 5001
```

### 5. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend folder
cd frontend

# Open with a local server (choose one):

# Option 1: Using Python
python -m http.server 3000

# Option 2: Using Node.js http-server
npx http-server -p 3000

# Option 3: Using VS Code Live Server extension
# Right-click on index.html → "Open with Live Server"
```

### 6. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

---

## 📁 Project Structure

```
ConvoCraft/
├── backend/
│   ├── server.js              # Main server file
│   ├── db.js                  # Database handler
│   ├── db.json               # JSON database file
│   ├── package.json          # Backend dependencies
│   └── .env                  # Environment variables (create this)
│
├── frontend/
│   ├── index.html            # Landing page
│   ├── login.html            # Login page
│   ├── signup.html           # Signup page
│   ├── forgot-password.html  # Password reset page
│   ├── app.html              # Main application
│   ├── style1.css            # Hero/landing styles
│   ├── style2.css            # Auth pages styles
│   ├── script1.js            # Landing page logic
│   ├── script.js             # Main app logic
│   └── convocraft-logo.png   # Logo image
│
├── .gitignore                # Git ignore file
└── README.md                 # This file
```

---

## 🎮 Usage Guide

### 1. Create an Account
- Click **"Create Account"** on the homepage
- Fill in your name, email, and password
- You'll be automatically logged in

### 2. Generate Icebreakers
- Select a **situation** (e.g., College, Office, Gym)
- Choose your **personality style** (Introvert, Extrovert, etc.)
- Click **"Generate Icebreakers"**
- Get 3 unique conversation starters!

### 3. Get Reply Suggestions
- Enter what someone said to you
- Click **"Suggest Replies"**
- Receive 3 follow-ups, 1 empathetic response, and 1 humorous option

### 4. Practice Conversations
- Go to the **Practice Chat** section
- Start chatting with the AI
- After 3 messages, see your conversation score:
  - **Confidence** - How assertive you are
  - **Empathy** - How well you understand others
  - **Curiosity** - How engaged you are

---

## 🔐 API Endpoints

### Authentication
- `POST /signup` - Create new user account
- `POST /login` - Login and get JWT token
- `GET /me` - Get current user info (requires auth)
- `POST /forgot-password` - Request password reset code
- `POST /reset-password` - Reset password with code

### Features
- `POST /generate` - Generate icebreakers
- `POST /suggest-replies` - Get reply suggestions
- `POST /practice-chat` - Chat with AI (saves to history)
- `GET /history` - Get user's chat history

---

## 🎨 Customization

### Change Theme Colors

Edit `style1.css`:
```css
:root {
  --primary-color: #4F46E5;  /* Change primary color */
  --secondary-color: #10B981; /* Change secondary color */
}
```

### Add More Situations

Edit `script.js` and add to `conversationData`:
```javascript
conversationData: {
  "Your New Situation": {
    "Introvert": ["Icebreaker 1", "Icebreaker 2"],
    "Extrovert": ["Icebreaker 1", "Icebreaker 2"],
    // ... more personalities
  }
}
```

### Modify Hero Images

Edit `script1.js`:
```javascript
var HERO_IMAGES = [
  "your-image-1.jpg",
  "your-image-2.jpg",
  "https://your-url.com/image.jpg"
];
```

---

## 🐛 Troubleshooting

### "Cannot read properties of undefined"
- Make sure the backend server is running on port 5001
- Check that `.env` file has correct API keys

### "401 Unauthorized" Error
- Ensure you're logged in
- Check if token exists in localStorage: `localStorage.getItem('token')`

### Database not saving users
- Check if `db.json` file exists in backend folder
- Verify file permissions (should be readable/writable)

### CORS Errors
- Make sure `app.use(cors())` is in `server.js`
- Backend must be running on port 5001

---

## 🚀 Deployment

### Deploy Backend (Heroku/Railway/Render)

1. Create account on your preferred platform
2. Connect your GitHub repository
3. Set environment variables in platform settings
4. Deploy!

### Deploy Frontend (Vercel/Netlify)

1. Connect GitHub repository
2. Set build directory to `frontend`
3. Update API URLs to your deployed backend URL
4. Deploy!

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Geethika Gattu** - *Initial work* - [@geethikagattu](https://github.com/geethikagattu)

---

## 🙏 Acknowledgments

- Google Gemini AI for powering the conversation generation
- Unsplash for beautiful hero images
- The open-source community for inspiration

---

## 📧 Contact & Support

- **GitHub Issues**: [Report a bug](https://github.com/geethikagattu/Convo-Craft/issues)
- **Email**: your.email@example.com

---

## 🎯 Future Roadmap

- [ ] Mobile app (React Native)
- [ ] Voice-based conversation practice
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social sharing features
- [ ] Chrome extension for real-time suggestions
- [ ] Integration with messaging platforms

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/geethikagattu/Convo-Craft?style=social)
![GitHub forks](https://img.shields.io/github/forks/geethikagattu/Convo-Craft?style=social)
![GitHub issues](https://img.shields.io/github/issues/geethikagattu/Convo-Craft)
![GitHub license](https://img.shields.io/github/license/geethikagattu/Convo-Craft)

---

**Made with ❤️ for better conversations**

⭐ Star this repo if you find it helpful!
