"""Gemini AI Provider implementation (default provider)."""
import os
from typing import AsyncGenerator, List, Optional

import httpx

from app.core.ai.base import BaseAIProvider, Message


class GeminiProvider(BaseAIProvider):
    """Google Gemini AI provider."""

    BASE_URL = "https://generativelanguage.googleapis.com/v1beta"
    EMBED_URL = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent"

    @property
    def default_model(self) -> str:
        return "gemini-1.5-pro"

    def _build_contents(self, messages: List[Message], system_prompt: Optional[str]) -> dict:
        contents = []
        if system_prompt:
            # Gemini uses system_instruction separately
            pass
        for msg in messages:
            role = "user" if msg.role == "user" else "model"
            contents.append({"role": role, "parts": [{"text": msg.content}]})
        return contents

    async def chat(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.7,
    ) -> str:
        url = f"{self.BASE_URL}/models/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": self._build_contents(messages, system_prompt),
            "generationConfig": {"maxOutputTokens": max_tokens, "temperature": temperature},
        }
        if system_prompt:
            payload["system_instruction"] = {"parts": [{"text": system_prompt}]}

        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]

    async def stream_chat(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.7,
    ) -> AsyncGenerator[str, None]:
        url = f"{self.BASE_URL}/models/{self.model}:streamGenerateContent?alt=sse&key={self.api_key}"
        payload = {
            "contents": self._build_contents(messages, system_prompt),
            "generationConfig": {"maxOutputTokens": max_tokens, "temperature": temperature},
        }
        if system_prompt:
            payload["system_instruction"] = {"parts": [{"text": system_prompt}]}

        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream("POST", url, json=payload) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        import json
                        try:
                            data = json.loads(line[6:])
                            text = data["candidates"][0]["content"]["parts"][0]["text"]
                            yield text
                        except (KeyError, json.JSONDecodeError):
                            continue

    async def embed(self, text: str) -> List[float]:
        url = f"{self.EMBED_URL}?key={self.api_key}"
        payload = {"model": "models/text-embedding-004", "content": {"parts": [{"text": text}]}}
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            return response.json()["embedding"]["values"]
