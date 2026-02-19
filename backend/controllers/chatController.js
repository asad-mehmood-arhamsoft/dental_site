const Chat = require('../models/Chat');
const Patient = require('../models/Patient');
const axios = require('axios');
const { validationResult } = require('express-validator');

const callAIService = async (message, patientContext = null) => {
  try {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5000';
    const response = await axios.post(`${aiServiceUrl}/generate`, {
      message,
      patientContext
    }, {
      timeout: 30000 // 30 second timeout
    });
    return response.data.response || response.data;
  } catch (error) {
    console.error('AI Service error:', error.message);
    // Fallback response if AI service fails
    return `I understand you're asking about: "${message}". As a dental assistant, I recommend consulting with your dentist for specific medical advice. How can I help you today?`;
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patientId, message } = req.body;

    // Verify patient belongs to user
    const patient = await Patient.findById(patientId, req.user.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Prepare patient context for AI
    const patientContext = {
      name: patient.name,
      medicalNotes: patient.medical_notes
    };

    // Call AI service
    const aiResponse = await callAIService(message, patientContext);

    // Store chat message
    const chatMessage = await Chat.create({
      patientId,
      userId: req.user.id,
      message,
      aiResponse
    });

    res.json({
      message: 'Chat message sent successfully',
      chat: chatMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Verify patient belongs to user
    const patient = await Patient.findById(patientId, req.user.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const messages = await Chat.findByPatient(patientId, req.user.id);
    res.json({ messages });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
