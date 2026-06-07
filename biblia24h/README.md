# Bíblia24h — Protótipo Web App + PWA

> _"Acompanhando sua jornada com Deus 24 horas por dia."_
> Mais que uma Bíblia. Um ecossistema completo de crescimento espiritual.

Protótipo visual de alta fidelidade do app **Bíblia24h (MVP 1.0)**, pronto para
ser aberto no navegador e usado como referência para o **protótipo no Figma**.

## Como abrir

**Forma mais fácil (recomendada):** abra o arquivo único e autossuficiente, com
HTML, CSS e JS embutidos — funciona com duplo-clique, sem servidor:

```
biblia24h-app.html   (na raiz do repositório)
```

Ou, a versão modular (vários arquivos):

```
biblia24h/index.html
```

Para testar o **PWA** (service worker + instalação) é preciso servir via HTTP local:

```bash
cd biblia24h
python3 -m http.server 8080
# abra http://localhost:8080
```

> Dica: no Chrome/desktop, deixe a janela estreita (modo mobile no DevTools,
> ~430px) para ver o app como na tela do celular. Em telas grandes ele aparece
> dentro de uma moldura de smartphone.

## O que está incluído

**Telas principais (todas funcionais e navegáveis):**

| Tela | Inspiração | Destaques |
|---|---|---|
| **Início** | Headspace/Apple | Saudação dinâmica, Versículo do Dia, Devocional (hero card), Continue de onde parou, Acesso rápido, recomendações, Reflexão da Noite |
| **Bíblia** | Apple Books | Seletor de versões (ARC/ARA/NVI/NVT/KJV/ESV), leitor de Mateus 6 com destaques por categoria, busca, navegação de capítulos |
| **Estudo** | Netflix | Posters, hero em destaque, "Continue assistindo", trilhas por categoria, detalhe do curso com aulas |
| **Áudio** | Spotify | Grade de capas, lista de episódios, **mini player** flutuante com play/pause |
| **Loja B24h** | E-commerce premium | Grade de produtos, biblioteca, categorias |
| **Perfil** | — | Avatar, streak de fé, estatísticas, conquistas (badges), menu de configurações |
| **Devocional / Curso** | — | Telas de leitura/detalhe com "marcar como concluído" e versão em áudio |

**Recursos transversais:**

- 🌗 **Tema claro / escuro / automático** (segue o sistema) — persistido em `localStorage`
- 🌍 **3 idiomas**: Português 🇧🇷 · English 🇺🇸 · Español 🇪🇸 (seletor no topo)
- 📱 **PWA**: `manifest.webmanifest` + service worker offline-first + ícones SVG
- 🔔 Bottom sheets para idioma/aparência, toasts, navegação inferior com 6 abas
- 🎨 **Design System** fiel à spec: roxo `#8B3DFF`, grafite, neumorfismo suave,
  cantos de 24px, cards flutuantes, ícones soft 3D

## Estrutura

```
biblia24h/
├── index.html              # Shell do app (status bar, viewport, nav, sheets)
├── styles.css              # Design System completo (tokens + componentes)
├── i18n.js                 # Strings em pt / en / es
├── data.js                 # Ícones SVG + dados mock (versículos, estudos, áudios, loja…)
├── app.js                  # Roteamento, render das telas e interações
├── manifest.webmanifest    # Metadados PWA
├── service-worker.js       # Cache offline
└── icons/                  # Ícones do app (SVG)
```

## Tokens de design (para reproduzir no Figma)

| Token | Valor |
|---|---|
| Roxo primário | `#8B3DFF` |
| Roxo escuro | `#6823D8` |
| Roxo claro | `#C9A7FF` |
| Fundo roxo | `#F3ECFF` |
| Grafite | `#1D1D1F` |
| Fundo | `#F6F6F8` |
| Sucesso / Aviso / Perigo | `#36B37E` / `#F7B955` / `#FF5A5F` |
| Raio card / botão / input | `24px` / `20px` / `18px` |
| Fonte | Inter |

## Observações

- Os dados são **mock** (exemplos). Backend (Supabase), autenticação (Google/Apple/Email),
  pagamentos (Stripe) e API bíblica completa fazem parte das próximas fases.
- Imagens de capa são geradas via gradientes/emoji para manter o protótipo
  100% offline e sem dependências externas.
