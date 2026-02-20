from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os
from data.mock_responses import MOCK_RESPONSES, CONTEXT_RESPONSES

app = Flask(__name__)
CORS(app)

def generate_mock_response(message, patient_context=None):
    """Generate a mock response from 20 different responses"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['schedule', 'appointment', 'book', 'when', 'time']):
        return CONTEXT_RESPONSES['schedule']
    
    elif any(word in message_lower for word in ['pain', 'hurt', 'ache', 'sore', 'discomfort']):
        return CONTEXT_RESPONSES['pain']
    
    elif any(word in message_lower for word in ['foot', 'leg', 'knee', 'ankle', 'back', 'shoulder']):
        return CONTEXT_RESPONSES['non_dental']
    
    elif any(word in message_lower for word in ['clean', 'cleaning', 'hygiene', 'brush', 'floss']):
        return CONTEXT_RESPONSES['cleaning']
    
    elif any(word in message_lower for word in ['cost', 'price', 'fee', 'charge', 'expensive', 'payment']):
        return CONTEXT_RESPONSES['cost']
    
    elif any(word in message_lower for word in ['hello', 'hi', 'hey', 'greeting', 'good morning', 'good afternoon']):
        return CONTEXT_RESPONSES['greeting']
    
    else:
        return random.choice(MOCK_RESPONSES)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'AI Service is running'})

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        message = data.get('message', '')
        patient_context = data.get('patientContext', None)

        if not message:
            return jsonify({'error': 'Message is required'}), 400

        ai_response = generate_mock_response(message, patient_context)
        print(f"Generated mock response for: {message[:50]}...")

        return jsonify({
            'response': ai_response,
            'model': 'mock'
        })

    except Exception as e:
        print(f"Error generating response: {str(e)}")
        return jsonify({
            'error': 'Failed to generate response',
            'response': generate_mock_response(message, patient_context) if 'message' in locals() else "I apologize, but I'm having trouble processing your request. Please try again."
        }), 500

if __name__ == '__main__':
    port = 5000
    app.run(host='0.0.0.0', port=port, debug=True)
