"""
gemini_client.py — Bug 9 Fix: This file was missing.
Provides generate_gemini_response() used by generate_suggestions.py
"""
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def generate_gemini_response(user_data, prompt):
    """
    Call the Gemini 1.5 Flash model with a prompt.
    Returns a list of suggestion strings.
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        text = response.text.strip()

        # Try to parse as JSON list
        try:
            result = json.loads(text)
            if isinstance(result, list):
                return result
        except Exception:
            pass

        # Fall back to splitting by newlines and stripping bullets
        lines = [line.strip("- •*123456789.").strip() for line in text.split("\n") if line.strip()]
        return [l for l in lines if len(l) > 10]  # filter very short lines

    except Exception as e:
        return [f"Unable to generate suggestions: {str(e)}. Please try again later."]
