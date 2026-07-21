"""
AI Provider Abstraction Layer for PersonalOS.
Supports OpenAI, Gemini, and Anthropic with a unified interface.
"""
from abc import ABC, abstractmethod
from typing import AsyncGenerator, List, Optional
from enum import Enum


class AIProvider(str, Enum):
    OPENAI = "openai"
    GEMINI = "gemini"
    ANTHROPIC = "anthropic"


class Message:
    def __init__(self, role: str, content: str):
        self.role = role
        self.content = content

    def to_dict(self) -> dict:
        return {"role": self.role, "content": self.content}


class BaseAIProvider(ABC):
    """Abstract base class for all AI providers."""

    def __init__(self, api_key: str, model: Optional[str] = None):
        self.api_key = api_key
        self.model = model or self.default_model

    @property
    @abstractmethod
    def default_model(self) -> str:
        pass

    @abstractmethod
    async def chat(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.7,
    ) -> str:
        """Send a chat completion request and return a response string."""
        pass

    @abstractmethod
    async def stream_chat(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.7,
    ) -> AsyncGenerator[str, None]:
        """Stream a chat completion response chunk by chunk."""
        pass

    @abstractmethod
    async def embed(self, text: str) -> List[float]:
        """Generate a text embedding vector."""
        pass
