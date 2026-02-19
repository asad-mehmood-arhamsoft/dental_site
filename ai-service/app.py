from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os

app = Flask(__name__)
CORS(app)

def generate_mock_response(message, patient_context=None):
    """Generate a mock response from 20 different responses"""
    message_lower = message.lower()
    
    # 20 different mock responses
    mock_responses = [
        "I'd be happy to help with your question! As a dental assistant, I can provide general information about dental care, appointments, and oral health. For specific medical advice, I'd recommend consulting with your dentist directly.",
        
        "Thank you for reaching out! Our dental office is here to assist you. Could you provide a bit more detail about what you'd like to know? I can help with scheduling, general dental questions, or oral hygiene tips.",
        
        "That's a great question! I'm here to help with your dental concerns. For personalized advice and treatment recommendations, I'd suggest scheduling a consultation with one of our dentists. Would you like help scheduling an appointment?",
        
        "I understand your concern. As a dental assistant, I can provide general guidance, but for specific diagnosis and treatment plans, it's best to speak directly with your dentist. Is there anything specific about dental care I can help clarify?",
        
        "Thanks for your message! Our team is committed to helping you maintain good oral health. For detailed information about your specific situation, I recommend booking an appointment. In the meantime, I'm happy to answer general questions about dental care.",
        
        "Hello! I'm here to assist with your dental questions. While I can provide general information about oral health and dental procedures, personalized medical advice should come from a direct consultation with your dentist. What would you like to know?",
        
        "I appreciate you reaching out! For the most accurate and helpful response to your question, I'd recommend speaking with our dental team directly. However, I can provide general information about dental care, hygiene, and scheduling. How can I help?",
        
        "Thank you for contacting us! As your dental assistant, I'm here to support your oral health journey. For specific treatment recommendations or diagnoses, please schedule a consultation. I can help with general questions in the meantime.",
        
        "That's an important question! I can provide general dental information and help with scheduling appointments. For personalized treatment advice, our dentists would be the best resource. Would you like to schedule a visit?",
        
        "I'm glad you asked! Our dental practice is dedicated to providing excellent care. For specific medical advice or treatment options, I'd recommend a consultation with your dentist. I can help with general questions about oral health and appointments.",
        
        "Thanks for your inquiry! I'm here to help with dental-related questions. While I can offer general guidance, detailed treatment plans and diagnoses should come from a direct consultation. What information are you looking for?",
        
        "Hello! I understand you have questions about dental care. I can provide general information and help you schedule appointments. For specific medical advice, our dentists are available for consultations. How can I assist you today?",
        
        "I appreciate you reaching out! Our dental team is here to help. For personalized treatment recommendations, I'd suggest scheduling an appointment. I can help with general questions about oral hygiene, procedures, or scheduling in the meantime.",
        
        "Thank you for your message! As a dental assistant, I can help with general dental questions and appointment scheduling. For specific diagnoses or treatment plans, please consult directly with your dentist. What would you like to know?",
        
        "That's a valid concern! I'm here to provide general dental information and support. For detailed treatment advice or diagnoses, I recommend speaking with our dentists directly. Would you like help scheduling a consultation?",
        
        "Thanks for contacting us! I can assist with general questions about dental care, oral hygiene, and scheduling appointments. For specific medical advice, our dentists would be happy to help during a consultation. How can I help you?",
        
        "I'm here to help! While I can provide general dental information, personalized treatment recommendations should come from a direct consultation with your dentist. I can help with scheduling or general questions about oral health.",
        
        "Hello! Thank you for reaching out. Our dental practice is committed to your oral health. For specific treatment advice, I'd recommend scheduling a visit. I can help with general questions about dental care and appointments in the meantime.",
        
        "I understand your question! As a dental assistant, I can provide general guidance about oral health and help with scheduling. For detailed treatment plans or diagnoses, please consult with your dentist directly. What information do you need?",
        
        "Thank you for your inquiry! I'm here to assist with dental questions and appointment scheduling. For personalized medical advice, our dentists are available for consultations. I can help with general information about dental care and procedures."
    ]
    
    # Context-aware selection for specific topics
    if any(word in message_lower for word in ['schedule', 'appointment', 'book', 'when', 'time']):
        return "To schedule an appointment, please call our office during business hours (Monday-Friday, 9 AM - 5 PM) or use our online booking system. Our friendly staff will help you find a convenient time. Is there a specific date or time that works best for you?"
    
    elif any(word in message_lower for word in ['pain', 'hurt', 'ache', 'sore', 'discomfort']):
        return "I understand you're experiencing discomfort. For pain management, I recommend contacting our office as soon as possible. In the meantime, you can try rinsing with warm salt water and avoiding hard or hot foods. However, for proper diagnosis and treatment, please consult with your dentist promptly."
    
    elif any(word in message_lower for word in ['foot', 'leg', 'knee', 'ankle', 'back', 'shoulder']):
        return "I'm a dental assistant, so I specialize in oral health and dental care. For concerns about foot pain, back pain, or other non-dental issues, I'd recommend consulting with a general practitioner or appropriate specialist. Is there anything dental-related I can help you with?"
    
    elif any(word in message_lower for word in ['clean', 'cleaning', 'hygiene', 'brush', 'floss']):
        return "Great question! For good oral hygiene, brush your teeth twice daily with fluoride toothpaste for at least 2 minutes, floss once a day, and use an antimicrobial mouthwash. Regular dental cleanings every 6 months help prevent cavities and gum disease. Would you like to schedule a cleaning appointment?"
    
    elif any(word in message_lower for word in ['cost', 'price', 'fee', 'charge', 'expensive', 'payment']):
        return "Pricing varies depending on the treatment needed. For specific cost information, please contact our office. We'd be happy to provide a detailed estimate and discuss payment options, including insurance coverage and payment plans. Would you like to schedule a consultation?"
    
    elif any(word in message_lower for word in ['hello', 'hi', 'hey', 'greeting', 'good morning', 'good afternoon']):
        return "Hello! I'm here to help with your dental questions. How can I assist you today? I can help with scheduling appointments, general dental information, or oral health questions."
    
    else:
        # Return a random response from the 20 mock responses
        return random.choice(mock_responses)

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

        # Generate mock response
        ai_response = generate_mock_response(message, patient_context)
        print(f"✅ Generated mock response for: {message[:50]}...")

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
