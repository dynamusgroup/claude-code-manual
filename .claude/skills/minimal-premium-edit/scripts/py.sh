#!/usr/bin/env bash
# Executa um script Python usando o venv da skill (faster-whisper etc.) quando existir.
SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PY="$SKILL/.venv/bin/python"; [ -x "$PY" ] || PY=python3
exec "$PY" "$@"
