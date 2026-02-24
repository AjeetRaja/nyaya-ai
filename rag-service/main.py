from fastapi import FastAPI
from pydantic import BaseModel
import json

app = FastAPI()

# Load BNS data from JSON file
with open("data/bns_sections.json", "r", encoding="utf-8") as file:
    bns_data = json.load(file)

class Question(BaseModel):
    question: str


@app.get("/")
def root():
    return {"message": "Nyaya-AI RAG Service Running 🚀"}


@app.post("/ask")
def ask_question(q: Question):

    user_question = q.question.lower()

    # Tamil detection
    is_tamil = any('\u0B80' <= ch <= '\u0BFF' for ch in user_question)

    # Search in JSON data
    for section in bns_data:

        if any(keyword in user_question for keyword in section["keywords"]):

            if is_tamil:
                return {
                    "answer": section["description_tamil"],
                    "section": section["section"],
                    "source": "Bharatiya Nyaya Sanhita 2023"
                }
            else:
                return {
                    "answer": section["description"],
                    "section": section["section"],
                    "source": "Bharatiya Nyaya Sanhita 2023"
                }

    return {
        "answer": "Section not found.",
        "section": "Unknown",
        "source": "Bharatiya Nyaya Sanhita 2023"
    }