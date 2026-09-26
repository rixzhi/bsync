import os
import json
from typing import List, Optional, Dict, Any

import torch
import torch.nn.functional as F
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from google import genai

# Load environment variables (expects a .env file or system env)
load_dotenv()

# Ensure the Gemini API key is available
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise EnvironmentError("GEMINI_API_KEY environment variable is not set.")

_gemini_client = genai.Client(api_key=GEMINI_API_KEY)
_GEMINI_MODEL = "gemini-3.8-flash"

# Initialize embedding model (runs once at import time)
_embedding_model = SentenceTransformer("all-mpnet-base-v2")

# Hard‑coded zoning rules for TS‑bPASS
_RULES = [
    {
        "id": "R1",
        "title": "Residential Setback",
        "text": "All residential buildings must maintain a minimum setback of 6 m from the front property line and 3 m from side and rear boundaries.",
    },
    {
        "id": "R2",
        "title": "Height Restriction",
        "text": "The maximum permissible built‑up height for residential zones is 12 m (approximately 3 storeys) unless a special waiver is granted.",
    },
    {
        "id": "R3",
        "title": "Road Width",
        "text": "Primary roads within the jurisdiction must have a minimum carriageway width of 9 m, with additional shoulder width of 1 m on each side.",
    },
    {
        "id": "R4",
        "title": "Water‑body Buffer",
        "text": "Construction activities must be situated at least 15 m away from any natural water body (river, lake, or stream) to protect the ecosystem.",
    },
]

# Pre‑compute embeddings for the rule texts (as a 2‑D torch Tensor)
_rule_texts = [rule["text"] for rule in _RULES]
_rule_embeddings = torch.tensor(_embedding_model.encode(_rule_texts, normalize_embeddings=True))


class ChatRequest(BaseModel):
    """Pydantic model for incoming chat payloads.

    Attributes
    ----------
    message: str
        The user's free‑form query.
    context_data: Optional[Dict[str, Any]]
        Optional additional data supplied by an officer (e.g., plan details).
    """

    message: str = Field(..., description="User's query message.")
    context_data: Optional[Dict[str, Any]] = Field(
        None, description="Optional extra context supplied by the officer."
    )


def _semantic_search(query: str, top_k: int = 3) -> List[Dict[str, str]]:
    """Return the *top_k* most similar zoning rules for *query*.

    The function uses cosine similarity on the pre‑computed rule embeddings.
    """
    query_emb = torch.tensor(_embedding_model.encode([query], normalize_embeddings=True))
    # Compute cosine similarity between query and each rule
    similarity = F.cosine_similarity(query_emb, _rule_embeddings, dim=1)
    top_indices = torch.topk(similarity, k=min(top_k, len(_RULES))).indices.tolist()
    return [_RULES[i] for i in top_indices]


def _format_citations(rules: List[Dict[str, str]]) -> str:
    """Create a concise citation block for the selected rules."""
    citations = []
    for rule in rules:
        citations.append(f"[{rule['id']}] {rule['title']}: {rule['text']}")
    return "\n".join(citations)


async def handle_citizen_chat(request: ChatRequest) -> Dict[str, Any]:
    """Process a citizen's query.

    Steps
    -----
    1. Retrieve the most relevant zoning rules.
    2. Query Gemini 3.8 Flash with a short, friendly prompt.
    3. Return the model's response (≤ 3 sentences) and the rule citations.
    """
    relevant_rules = _semantic_search(request.message, top_k=3)
    citations = _format_citations(relevant_rules)

    prompt = (
        f"You are a helpful assistant for the Telangana Building Permission Approval and Self‑Certification System (TS‑bPASS)."
        f" Answer the citizen's question in plain language, using no more than three sentences."
        f" Include the most relevant zoning rules where appropriate.\n\n"
        f"Citizen question: {request.message}\n\n"
        f"Relevant rules:\n{citations}\n\n"
        f"Provide a concise answer."
    )

    response = await _gemini_client.aio.models.generate_content(
        model=_GEMINI_MODEL,
        contents=prompt,
    )
    answer = response.text.strip()

    return {"answer": answer, "cited_rules": [rule["id"] for rule in relevant_rules]}


async def handle_officer_chat(request: ChatRequest) -> Dict[str, Any]:
    """Process an officer's query with technical depth.

    The officer may supply *context_data* (e.g., plan parameters). The function
    returns a detailed evaluation and a flag indicating whether any context was
    ingested.
    """
    relevant_rules = _semantic_search(request.message, top_k=5)
    citations = _format_citations(relevant_rules)

    # Serialize optional context for the model
    context_block = ""
    if request.context_data:
        try:
            context_json = json.dumps(request.context_data, indent=2)
            context_block = f"\n\nOfficer supplied context (JSON):\n{context_json}"
        except Exception:
            # Fallback to string representation if JSON fails
            context_block = f"\n\nOfficer supplied context: {request.context_data}"

    prompt = (
        f"You are a senior building‑code officer for TS‑bPASS."
        f" Using the citizen's query, the following zoning rules, and any supplied context,"
        f" provide a technical assessment of any code discrepancies, required corrective actions,"
        f" and next steps. Be thorough but concise.\n\n"
        f"Officer question: {request.message}\n"
        f"Relevant rules:\n{citations}{context_block}\n\n"
        f"Respond in a technical tone."
    )

    response = await _gemini_client.aio.models.generate_content(
        model=_GEMINI_MODEL,
        contents=prompt,
    )
    answer = response.text.strip()

    context_ingested = bool(request.context_data)

    return {
        "answer": answer,
        "cited_rules": [rule["id"] for rule in relevant_rules],
        "context_ingested": context_ingested,
    }

# The module purposefully does not expose any FastAPI routing – it is imported
# directly by the main application.
