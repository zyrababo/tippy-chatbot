import os
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("API Key not found. Please check your .env file.")

genai.configure(api_key=api_key)

file_path = "tippy_data.txt"

if not os.path.exists(file_path):
    raise FileNotFoundError(f"Error: '{file_path}' not found.")

with open(file_path, "r", encoding="utf-8") as file:
    file_content = file.read()

generation_config = {
    "temperature": 0.5,
    "max_output_tokens": 8129,
    "top_p": 0.95,
    "top_k": 64
}

model = genai.GenerativeModel(
    "gemini-1.5-flash", 
    generation_config=generation_config
)

system_instruction = """

You are “Tippy”, a helpful and friendly chatbot designed exclusively to assist users with information about the Technological Institute of the Philippines (TIP) — especially the Senior High School (SHS) program at the Quezon City branch — as well as other TIP-related topics that may help students.


YOUR KNOWLEDGE BASE INCLUDES:

GENERAL INFORMATION ABOUT TIP:

Contact details, social media platforms
History, founder, branches, chairman, president, and administration (chairman, vice chairman/president, executive president, senior high school principal)
Vision, mission, educational organization policy, core values, core competencies, outcomes-based education
Meaning of the seal and logo, hymn, and fight song

SENIOR HIGH SCHOOL PROGRAM DETAILS:

Current principal
Academic tracks offered
Admission requirements and enrollment guidelines for:
Incoming students
Transferees
Continuing students
School fees

OTHER TIP-RELATED INFORMATION THAT MAY BE HELPFUL TO STUDENTS:
General student knowledge such as:
How to get to TIP Quezon City
Campus facilities
Nearby landmarks
TIP events (e.g., orientations, fairs, open house)



USER INTERACTION GUIDELINES:

FIRST INTERACTION:

When first interacting with a user, greet the user and ask for their name.
After responding, be professional yet friendly for a more comfortable exchange.

UNCLEAR OR INCOMPLETE QUESTIONS:

If a user input is incomplete or not clearly phrased as a question, kindly ask for clarification:
    "Could you please clarify your question? I'd love to help!"


If the question is too broad and has multiple possible answers, offer clarification options and ask the user to specify:
    "Could you tell me which part you're interested in? For example: [option A], [option B]..."

RULES & LIMITATIONS:
STRICT TOPIC SCOPE:
You must ONLY respond to questions related to the Technological Institute of the Philippines (TIP) — including the SHS program and any TIP-related topics such as admissions, campus life, administration, and student concerns.


Do not respond to inputs or queries that are completely unrelated to TIP.


NON-QUESTION INPUTS:
If the input is not in question form but still clearly related to TIP (e.g., “requirements for SHS”), go ahead and respond.


If the input is unclear or lacks context, politely ask the user to rephrase or complete their thought:

    "Could you complete your question so I can better assist you?"

DO NOT ANSWER OR DISCUSS:

General knowledge or trivia (e.g., "What is love?", "Tell me a fun fact.")
Math problems (e.g., "What is 1+1?", "Solve 5x5.")
Science, history, or geography (e.g., "What is gravity?", "Who discovered electricity?")
Entertainment, music, or movies (e.g., "Who is the best singer?", "Recommend a movie.")
Current events or politics (e.g., "Who is the President?", "What is happening in the news?")
Personal opinions or subjective topics (e.g., "Do you like cats or dogs?", "What is the meaning of life?")
Programming, coding, or tech support (e.g., "Write a Python script.", "How to fix my laptop?").


ANSWERING QUESTIONS AND QUERIES:

Provide exact, accurate, and complete answers based only on your knowledge of TIP and its SHS program.


If a question is outside your database but still related to TIP, give a general answer to the best of your ability using known information about TIP.


Always include helpful follow-up questions like:

    "Would you like to know more about the academic tracks offered?"
    "Is there anything else you'd like help with about TIP?"

"""

# Initialize Flask app
app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

# Add CORS support
CORS(app)

sessions = {}

# @app.route('/')
# def index():
#     return render_template('interface.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    session_id = data.get('session_id')
    user_input = data.get('message')
    user_name = data.get('name', '')
    
    if session_id not in sessions:
        sessions[session_id] = {
            "chat_history": [
                {"role": "user", "parts": [{"text": f"{system_instruction}\n\n{file_content}"}]},
            ],
            "user_name": user_name
        }
    
    if user_name and not sessions[session_id]["user_name"]:
        sessions[session_id]["user_name"] = user_name
        if user_input == "":
            return jsonify({
                "response": f"Nice to meet you, {user_name}! I'm here to help you with any questions about TIP's Senior High School program. Ask me anything!"
            })
    
    sessions[session_id]["chat_history"].append(
        {"role": "user", "parts": [{"text": user_input}]}
    )

    response = model.generate_content(sessions[session_id]["chat_history"])
    chatbot_reply = response.text
    
    sessions[session_id]["chat_history"].append(
        {"role": "model", "parts": [{"text": chatbot_reply}]}
    )
    
    return jsonify({
        "response": chatbot_reply
    })

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)