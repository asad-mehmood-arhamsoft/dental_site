#!/usr/bin/env python3
"""Quick test script to verify AI API key is working"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv('ai-service/.env')

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

print("=" * 50)
print("AI Service Configuration Check")
print("=" * 50)

if OPENAI_API_KEY:
    print(f"✅ OPENAI_API_KEY: Found (starts with: {OPENAI_API_KEY[:7]}...)")
    if not OPENAI_API_KEY.startswith('sk-'):
        print("⚠️  WARNING: OpenAI API key should start with 'sk-'")
else:
    print("❌ OPENAI_API_KEY: Not found")

if OPENROUTER_API_KEY:
    print(f"✅ OPENROUTER_API_KEY: Found")
else:
    print("❌ OPENROUTER_API_KEY: Not found")

if not OPENAI_API_KEY and not OPENROUTER_API_KEY:
    print("\n❌ ERROR: No API keys found! The service will use mock responses.")
    print("\nTo fix this:")
    print("1. Get an API key from https://platform.openai.com/api-keys")
    print("2. Add it to ai-service/.env file:")
    print("   OPENAI_API_KEY=sk-your-key-here")
    print("3. Restart the AI service")
    sys.exit(1)

# Test OpenAI API if key exists
if OPENAI_API_KEY:
    print("\n" + "=" * 50)
    print("Testing OpenAI API...")
    print("=" * 50)
    try:
        import openai
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "Say 'API is working' if you can read this."}
            ],
            max_tokens=20
        )
        result = response.choices[0].message.content
        print(f"✅ OpenAI API is working!")
        print(f"Response: {result}")
    except Exception as e:
        print(f"❌ OpenAI API test failed!")
        print(f"Error: {str(e)}")
        print("\nPossible issues:")
        print("- Invalid API key")
        print("- Insufficient credits/balance")
        print("- Network connectivity issues")
        print("- API key expired or revoked")

print("\n" + "=" * 50)
