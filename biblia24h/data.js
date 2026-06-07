/* ============================================================
   Bíblia24h — Icons (inline SVG, soft 3D outline) + Mock data
   ============================================================ */

const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 3v16"/><path d="M4 19a2 2 0 0 0 2 2h13"/></svg>',
  study: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 8l10 5 10-5-10-5z"/><path d="M6 10.5V16c0 1 2.7 3 6 3s6-2 6-3v-5.5"/><path d="M22 8v6"/></svg>',
  audio: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14l-1 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
  chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevRight: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  chevLeft: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>',
  pray: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v7"/><path d="M9 6h6"/><path d="M7 21c0-4 2-6 5-6s5 2 5 6"/><path d="M5 21h14"/></svg>',
  plan: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="m9 14 2 2 4-4"/></svg>',
  word: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a4 4 0 0 0-4 4c0 1.5.8 2.5 1.5 3.5S11 12 11 14h2c0-2 .8-2.5 1.5-3.5S16 8.5 16 7a4 4 0 0 0-4-4z"/><path d="M10 18h4M11 21h2"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  cross: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M7 7h10"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.6 15H4a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1A2 2 0 1 1 7.9 5.4l.1.1A1.6 1.6 0 0 0 10 4.6V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 19.4 9H20a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 2z"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M6 4h12v5a6 6 0 0 1-12 0z"/><path d="M6 6H3v2a3 3 0 0 0 3 3M18 6h3v2a3 3 0 0 1-3 3"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .8-1 1.7M12 17h.01"/></svg>',
};

/* Gradient palette for generative cover art */
const GRADS = [
  "linear-gradient(135deg,#7b2cff,#2a0a66)",
  "linear-gradient(135deg,#ff7a59,#b5179e)",
  "linear-gradient(135deg,#0ea5e9,#6823d8)",
  "linear-gradient(135deg,#36b37e,#0b6e4f)",
  "linear-gradient(135deg,#f7b955,#ef4444)",
  "linear-gradient(135deg,#8b3dff,#ff5a5f)",
  "linear-gradient(135deg,#3a1c71,#d76d77)",
  "linear-gradient(135deg,#1f4037,#99f2c8)",
];

const DATA = {
  user: { name: "Samuel", initials: "S", email: "samuel@biblia24h.com", streak: 24, chapters: 187, plans: 5, verses: 42 },

  verse: {
    pt: { text: "Entrega o teu caminho ao Senhor; confia nele, e o mais Ele fará.", ref: "Salmos 37:5" },
    en: { text: "Commit your way to the Lord; trust in him, and he will act.", ref: "Psalm 37:5" },
    es: { text: "Encomienda al Señor tu camino; confía en él, y él actuará.", ref: "Salmos 37:5" },
  },

  devotional: {
    pt: { title: "Deus cuida de cada detalhe da sua vida", desc: "Conheça as três verdades que renovam a sua fé mesmo nos dias difíceis.", time: 5,
      body: ["Em meio à correria do dia, é fácil esquecer que Deus está atento a cada detalhe da sua história. Ele conta os cabelos da sua cabeça e guarda as suas lágrimas.",
        "Quando Jesus falou sobre os lírios do campo e as aves do céu, Ele estava nos lembrando de uma verdade poderosa: se o Pai cuida do menor dos seres, quanto mais cuidará de você.",
        "Hoje, entregue a Ele as suas preocupações. Respire. Confie. O mesmo Deus que abriu o Mar Vermelho conhece exatamente o que você está vivendo.",
        "Não existe detalhe pequeno demais para a atenção de Deus, nem problema grande demais para o Seu poder."] },
    en: { title: "God cares about every detail of your life", desc: "Discover three truths that renew your faith even on hard days.", time: 5,
      body: ["In the rush of the day, it's easy to forget that God is attentive to every detail of your story.",
        "When Jesus spoke about the lilies of the field, He reminded us of a powerful truth: if the Father cares for the least, how much more for you.",
        "Today, give Him your worries. Breathe. Trust.","No detail is too small for God's attention."] },
    es: { title: "Dios cuida cada detalle de tu vida", desc: "Descubre tres verdades que renuevan tu fe incluso en los días difíciles.", time: 5,
      body: ["En medio del ajetreo del día, es fácil olvidar que Dios está atento a cada detalle de tu historia.",
        "Cuando Jesús habló de los lirios del campo, nos recordó una verdad poderosa.",
        "Hoy, entrégale tus preocupaciones. Respira. Confía.","Ningún detalle es demasiado pequeño para la atención de Dios."] },
  },

  continueBook: { book: "Mateus", bookEn: "Matthew", bookEs: "Mateo", chapter: 6, progress: 67 },

  studies: [
    { id:1, title:"Batalha Espiritual", cat:"Guerra", icon:"⚔️", g:0, lessons:12, prog:45, instructor:"Pr. André Lima" },
    { id:2, title:"Teologia Sistemática", cat:"Doutrina", icon:"📖", g:2, lessons:24, prog:20, instructor:"Pr. Daniel Souza" },
    { id:3, title:"O Espírito Santo", cat:"Pneumatologia", icon:"🔥", g:5, lessons:8, prog:0, instructor:"Pr. Marcos Reis" },
    { id:4, title:"Família segundo Deus", cat:"Família", icon:"🏠", g:3, lessons:10, prog:80, instructor:"Pr. João e Ana" },
    { id:5, title:"Casamento Restaurado", cat:"Casamento", icon:"💍", g:1, lessons:7, prog:100, instructor:"Pr. Lucas Mendes" },
    { id:6, title:"Escatologia", cat:"Profecia", icon:"🕊️", g:6, lessons:15, prog:0, instructor:"Pr. Daniel Souza" },
    { id:7, title:"Liderança Cristã", cat:"Liderança", icon:"🧭", g:7, lessons:9, prog:0, instructor:"Pr. Tiago Alves" },
    { id:8, title:"Evangelismo na Prática", cat:"Missões", icon:"🌍", g:4, lessons:6, prog:30, instructor:"Miss. Clara" },
  ],

  audios: [
    { id:1, title:"A Fé que Move Montanhas", author:"Pr. André Lima", cat:"Pregações", icon:"🎙️", g:0, dur:"32 min" },
    { id:2, title:"Salmos para a Ansiedade", author:"Bíblia Narrada", cat:"Bíblia Narrada", icon:"📖", g:2, dur:"18 min" },
    { id:3, title:"Oração da Manhã", author:"Bíblia24h", cat:"Orações", icon:"🙏", g:3, dur:"7 min" },
    { id:4, title:"Devocional: Descanso em Deus", author:"Ana Reis", cat:"Devocionais", icon:"🌅", g:1, dur:"5 min" },
    { id:5, title:"O Poder do Sangue", author:"Pr. Marcos Reis", cat:"Pregações", icon:"✝️", g:5, dur:"41 min" },
    { id:6, title:"Estudo de Romanos 8", author:"Pr. Daniel Souza", cat:"Estudos Bíblicos", icon:"📚", g:4, dur:"28 min" },
    { id:7, title:"Adoração Instrumental", author:"B24h Worship", cat:"Orações", icon:"🎵", g:6, dur:"60 min" },
  ],

  products: [
    { id:1, name:"Bíblia de Estudo Pentecostal", cat:"Livros", icon:"📕", g:0, price:"R$ 129,90", tag:"-20%" },
    { id:2, name:"Devocional 365 Dias", cat:"eBooks", icon:"📘", g:2, price:"R$ 29,90" },
    { id:3, name:"Curso: Batalha Espiritual", cat:"Cursos", icon:"⚔️", g:5, price:"R$ 89,00" },
    { id:4, name:"Kit Casamento Restaurado", cat:"Kits", icon:"💝", g:1, price:"R$ 149,00", tag:"Novo" },
    { id:5, name:"Jejum & Oração (eBook)", cat:"eBooks", icon:"🕯️", g:3, price:"R$ 19,90" },
    { id:6, name:"Conferência Avivamento", cat:"Conferências", icon:"🔥", g:4, price:"R$ 59,00" },
  ],

  badges: [
    { icon:"🔥", name:"7 dias", unlocked:true },
    { icon:"📖", name:"100 caps", unlocked:true },
    { icon:"🙏", name:"Guerreiro de Oração", unlocked:true },
    { icon:"🏆", name:"Plano completo", unlocked:true },
    { icon:"🌙", name:"Vigília", unlocked:false },
    { icon:"💎", name:"365 dias", unlocked:false },
  ],

  // A real chapter for the Bible reader (Mateus 6 — Sermão do Monte, pt-BR ARC-style)
  chapter: {
    book: { pt:"Mateus", en:"Matthew", es:"Mateo" }, number: 6, version: "ARC",
    verses: [
      { n:1, t:"Guardai-vos de fazer a vossa esmola diante dos homens, para serdes vistos por eles; aliás, não tereis galardão junto de vosso Pai que está nos céus." },
      { n:5, t:"E, quando orares, não sejas como os hipócritas; pois se comprazem em orar em pé nas sinagogas e nas esquinas das ruas, para serem vistos pelos homens.", hl:"faith" },
      { n:6, t:"Mas tu, quando orares, entra no teu aposento e, fechando a tua porta, ora a teu Pai que está em secreto; e teu Pai, que vê em secreto, te recompensará." },
      { n:9, t:"Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome." },
      { n:10, t:"Venha o teu Reino. Seja feita a tua vontade, assim na terra como no céu." },
      { n:11, t:"O pão nosso de cada dia nos dá hoje.", hl:"promise" },
      { n:25, t:"Por isso, vos digo: não andeis cuidadosos quanto à vossa vida, pelo que haveis de comer ou pelo que haveis de beber; nem quanto ao vosso corpo, pelo que haveis de vestir.", hl:"wisdom" },
      { n:33, t:"Mas buscai primeiro o Reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.", hl:"promise" },
      { n:34, t:"Não vos inquieteis, pois, pelo dia de amanhã, porque o dia de amanhã cuidará de si mesmo. Basta a cada dia o seu mal." },
    ],
  },

  bibleBooks: ["Gênesis","Êxodo","Levítico","Salmos","Provérbios","Isaías","Mateus","Marcos","Lucas","João","Atos","Romanos","Apocalipse"],
  bibleVersions: ["ARC","ARA","NVI","NVT","KJV","ESV"],

  nightReflection: {
    pt: ["Você não está sozinho nesta noite.", "Ainda existe esperança para sua história.", "Deus continua trabalhando mesmo quando você não vê.", "Não desista. O Senhor permanece fiel."],
    en: ["You are not alone tonight.", "There is still hope for your story.", "God keeps working even when you don't see it.", "Don't give up. The Lord remains faithful."],
    es: ["No estás solo esta noche.", "Todavía hay esperanza para tu historia.", "Dios sigue obrando aunque no lo veas.", "No te rindas. El Señor permanece fiel."],
  },
};
