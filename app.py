from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from openai import OpenAI
from datetime import datetime
from dotenv import load_dotenv
import markdown2
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
# Enable CORS for the React frontend (running on port 5173 during dev)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'agri-secret-key-2025')

# ✅ Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:pass123@localhost:3306/test'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ✅ Chat history model
class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "question": self.question,
            "answer": self.answer,
            "timestamp": self.timestamp.strftime('%d %b %Y, %I:%M %p')
        }

# ✅ OpenAI client (via OpenRouter) — loaded from .env
client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY'),
    base_url=os.getenv('OPENAI_BASE_URL', 'https://openrouter.ai/api/v1'),
    default_headers={
        "HTTP-Referer": "http://localhost:5000", # Required for OpenRouter
        "X-Title": "Agriculture Chatbot", # Optional but recommended
    }
)

MODEL_NAME = os.getenv('MODEL_NAME', 'openai/gpt-4o-mini')

@app.route("/api/history", methods=["GET"])
def get_history():
    """Returns the last 10 chat messages"""
    try:
        chats = Chat.query.order_by(Chat.timestamp.desc()).limit(15).all()
        return jsonify([chat.to_dict() for chat in chats]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/chat", methods=["POST"])
def chat():
    """Handles a new chat question and returns the AI response"""
    data = request.json
    if not data or "question" not in data:
        return jsonify({"error": "No question provided"}), 400
        
    user_input = data["question"].strip()
    if not user_input:
        return jsonify({"error": "Question cannot be empty"}), 400

    try:
        # 💬 GPT call via OpenRouter
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert agriculture assistant. Answer only questions related to "
                        "farming, soil, irrigation, fertilizers, weather, crops, and pests. "
                        "Format your answers with bold subheadings. "
                        "Avoid using hyphens for bullet points. "
                        "Do not answer unrelated questions."
                    )
                },
                {"role": "user", "content": user_input}
            ]
        )

        raw_response = completion.choices[0].message.content

        # ✅ Convert markdown to HTML so React can render it safely
        response_html = markdown2.markdown(raw_response)

        # 💾 Save chat to DB
        new_chat = Chat(question=user_input, answer=response_html)
        db.session.add(new_chat)
        db.session.commit()

        return jsonify({
            "success": True, 
            "chat": new_chat.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    # Run on port 5000
    app.run(debug=True, port=5000)
