#!/usr/bin/env bash
# Instala tudo que o agente "Minimal Premium" precisa. Idempotente. Uso: bash setup.sh
set -euo pipefail
SKILL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ok(){ echo "  ✔ $*"; }; bad(){ echo "  ✘ $*"; }

echo "== Sistema =="
command -v ffmpeg >/dev/null && ok "ffmpeg $(ffmpeg -version | head -1 | awk '{print $3}')" || bad "ffmpeg ausente (brew install ffmpeg | apt install ffmpeg)"
command -v node   >/dev/null && ok "node $(node -v)" || bad "node ausente (precisa 18+; recomendado 22)"
command -v python3 >/dev/null && ok "python3 $(python3 --version | awk '{print $2}')" || bad "python3 ausente"

echo "== Remotion (modelo de animação) =="
( cd "$SKILL/remotion" && npm install --no-audit --no-fund >/dev/null 2>&1 && ok "npm install (remotion 4.0.543, fontes Playfair Display + Inter embutidas)" ) || bad "npm install falhou"

echo "== Navegador para o render =="
BROWSER="${REMOTION_BROWSER:-}"
if [ -z "$BROWSER" ]; then
  for c in /opt/pw-browsers/chromium-*/chrome-linux*/chrome "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" /usr/bin/google-chrome /usr/bin/chromium /usr/bin/chromium-browser; do
    for f in $c; do [ -x "$f" ] && BROWSER="$f" && break 2; done
  done
fi
if [ -n "$BROWSER" ]; then ok "Chrome: $BROWSER  (exporte REMOTION_BROWSER=\"$BROWSER\")"; else echo "  • Nenhum Chrome local: o Remotion baixa o dele no 1º render (precisa de internet)."; fi

echo "== Transcrição (Whisper local) =="
if [ ! -x "$SKILL/.venv/bin/python" ]; then python3 -m venv "$SKILL/.venv"; fi
"$SKILL/.venv/bin/pip" install -q --disable-pip-version-check faster-whisper numpy pillow >/dev/null 2>&1 && ok "faster-whisper, numpy, pillow em $SKILL/.venv" || bad "pip install falhou"

echo
echo "Pronto. Próximo passo: crie a pasta do projeto com  python3 $SKILL/scripts/init_project.py \"<pasta>/Editor Minimal\""
