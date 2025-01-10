from typing import List, Dict, Optional
from openai import OpenAI
from .prompts import SYSTEM_PROMPT
from .functions import functions, function_map
import json
import os
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

# Configure OpenAI with API key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

print(f"OpenAI API Key Loaded: {client.api_key}")

if not client.api_key:
    raise ValueError("No OpenAI API key found. Please set OPENAI_API_KEY environment variable.")

class RecipeAgent:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
    def process_message(
        self,
        message: str,
        conversation_history: List[Dict] = None
    ) -> Dict:
        """
        Process a user message and return a response without any database logic.
        """
        if conversation_history is None:
            conversation_history = []

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]

        # Add conversation history
        messages.extend(conversation_history)

        # Add the current message
        messages.append({"role": "user", "content": message})

        try:
            final_response = self.client.chat.completions.create(
                model="gpt-4",
                messages=messages
            )

            final_message = final_response.choices[0].message

            return {
                "reply": final_message.content,
                "reasoning": None,
                "data": None
            }

        except Exception as e:
            print(f"OpenAI API error: {e}")
            print(f"Error details: {str(e)}")
            traceback.print_exc()
            return {
                "reply": f"I apologize, but I encountered an error: {str(e)}",
                "reasoning": None,
                "data": None
            }

# Global instance
recipe_agent = RecipeAgent()

def get_agent():
    """Getter function for the agent instance"""
    return recipe_agent
