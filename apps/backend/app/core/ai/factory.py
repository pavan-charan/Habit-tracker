"""AI Provider Factory — resolves the correct provider at runtime."""
import os
from functools import lru_cache
from typing import Optional

from app.core.ai.base import AIProvider, BaseAIProvider
from app.core.ai.gemini import GeminiProvider


def get_ai_provider(
    provider: Optional[AIProvider] = None,
    api_key: Optional[str] = None,
    model: Optional[str] = None,
) -> BaseAIProvider:
    """
    Factory that returns an initialized AI provider.
    Defaults to Gemini using GEMINI_API_KEY from environment.
    """
    resolved_provider = provider or AIProvider(os.getenv("AI_PROVIDER", "gemini"))

    if resolved_provider == AIProvider.GEMINI:
        key = api_key or os.getenv("GEMINI_API_KEY", "")
        return GeminiProvider(api_key=key, model=model)

    elif resolved_provider == AIProvider.OPENAI:
        from app.core.ai.openai_provider import OpenAIProvider
        key = api_key or os.getenv("OPENAI_API_KEY", "")
        return OpenAIProvider(api_key=key, model=model)

    elif resolved_provider == AIProvider.ANTHROPIC:
        from app.core.ai.anthropic_provider import AnthropicProvider
        key = api_key or os.getenv("ANTHROPIC_API_KEY", "")
        return AnthropicProvider(api_key=key, model=model)

    raise ValueError(f"Unsupported AI provider: {resolved_provider}")


# Dependency for FastAPI injection
def get_ai_service() -> BaseAIProvider:
    return get_ai_provider()
