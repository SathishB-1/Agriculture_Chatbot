# 🌾 Agriculture AI Chatbot

A full-stack AI-powered chatbot that provides expert advice to farmers and agriculturists. The chatbot only responds to topics like farming, soil, crops, irrigation, fertilizers, weather, and pests — all other questions are politely declined.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Backend | Python (Flask REST API) |
| Database | MySQL (via PyMySQL + SQLAlchemy) |
| AI Model | GPT-4o-mini (via OpenRouter) |
| Styling | Pure CSS with Google Fonts |

---

## ✨ Features

- 💬 **AI Chat Interface** — Real-time chat powered by GPT-4o-mini
- 📜 **Chat History Sidebar** — Past questions loaded from MySQL and displayed in the sidebar
- 🌿 **Agriculture-Only Mode** — The bot refuses to answer non-agriculture questions
- 🎨 **Modern UI** — Built with React and custom CSS with smooth hover animations
- 📡 **REST API Backend** — Flask serves JSON responses, fully decoupled from the UI
- 💾 **Database Persistence** — Every question and answer is saved to MySQL

---

## 📁 Project Structure

```
Agriculture_Chatbot/
│
├── app.py                  # Flask REST API
├── requirements.txt        # Python package list
├── .env                    # API keys (not committed to Git)
│
└── frontend/               # React Application
    ├── package.json
    └── src/
        ├── App.jsx          # Main chat UI component
        └── index.css        # All custom styles
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+ and npm
- MySQL Server (running locally)

### Step 1 — Clone the Repository
```bash
git clone <your-repo-url>
cd Agriculture_Chatbot
```

### Step 2 — Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate         # Windows
source venv/bin/activate        # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt
```

### Step 3 — Configure Environment Variables
Create a `.env` file in the root folder:
```env
OPENAI_API_KEY=sk-or-v1-your-openrouter-key-here
MODEL_NAME=openai/gpt-4o-mini
OPENAI_BASE_URL=https://openrouter.ai/api/v1
```

### Step 4 — Configure MySQL Database
Update the connection string in `app.py` (Line 16):
```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/YOUR_DB'
```

### Step 5 — Frontend Setup
```bash
cd frontend
npm install
```

---

## ▶️ Running the Application

You need **two terminals** running simultaneously.

**Terminal 1 — Flask Backend:**
```bash
.\venv\Scripts\activate
python app.py
```
> Runs at: `http://127.0.0.1:5000`

**Terminal 2 — React Frontend:**
```bash
cd frontend
npm run dev
```
> Runs at: `http://localhost:5173`

Then open your browser and visit: **http://localhost:5173** 🎉

---

## 💬 Sample Questions to Test

- *"What is the best time to sow wheat in India?"*
- *"How do I improve the fertility of clay soil?"*
- *"How can I protect my crops from frost damage?"*
- *"What is the difference between drip and sprinkler irrigation?"*
- *"How do I control aphids on tomatoes naturally?"*

---

## 📜 License

This project is open-source and available under the **MIT License**.

---

## 🚀 Future Enhancements

Here are some planned improvements that can make this project even more powerful:

- 🌐 **Multi-Language Support** — Allow farmers to interact in regional languages like Hindi, Tamil, and Telugu.
- 🖼️ **Image Upload for Crop Diagnosis** — Let farmers upload photos of diseased plants and get an AI-powered diagnosis.
- 📍 **Location-Based Advice** — Integrate a weather API to provide crop advice based on the user's current location and season.
- 🔐 **User Authentication** — Add login and registration so each farmer has their own personal chat history.
- 📱 **Mobile App (React Native)** — Convert the React frontend into a mobile app for easier use in rural areas.
- 📊 **Admin Dashboard** — A panel for admins to view all questions asked, popular topics, and user activity.
- 🤖 **Fine-Tuned Agriculture Model** — Train a custom model specifically on Indian agriculture data for more accurate answers.
- 🗣️ **Voice Input/Output** — Allow farmers to speak their questions instead of typing, with spoken responses back.

---

## 🌟 Benefits

| Benefit | Description |
|---|---|
| ✅ Always Available | 24/7 AI assistance — no need to wait for an expert |
| 📚 Expert Knowledge | Powered by GPT-4o-mini with domain-specific instructions |
| 🌱 Farmer-Friendly | Simple, clean UI that is easy to use even for first-time users |
| 💾 Keeps History | All past questions are saved so farmers can revisit answers anytime |
| 🔒 Focused & Safe | Only answers agriculture questions — no off-topic distractions |
| 💸 Cost Effective | Helps small farmers make informed decisions without hiring consultants |
| 🌍 Scalable | REST API design makes it easy to scale or integrate into other platforms |

