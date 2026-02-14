/**
 * ConvoCraft – AI Conversation Assistant
 * FRONTEND ONLY VERSION (No backend required)
 */

(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'convocraft-theme';

  /* =============================
     THEME
  ============================== */

  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');

  function applyTheme(isDark) {
    if (isDark) body.classList.add('dark-mode');
    else body.classList.remove('dark-mode');
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    applyTheme(saved === 'dark');
  }

  function onThemeToggle() {
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  }

  /* =============================
     DATASET
  ============================== */

  const conversationData = {
    College: {
      Introvert: [
        "Hey, is this seat taken?",
        "Did you understand today's lecture?",
        "Are you submitting the assignment today?",
        "Do you usually study here?"
      ],
      Extrovert: [
        "Which club are you in?",
        "Are you planning to attend the fest?",
        "What's your major?"
      ],
      Funny: [
        "Are we pretending to understand this class?",
        "Group study or group suffering?"
      ],
      Ambivert: [
        "Have you joined any campus groups?",
        "How's this semester going for you?"
      ],
      Calm: [
        "How's your day going?",
        "Which subject do you enjoy most?"
      ]
    },
    Office: {
      Introvert: [
        "Hi, are you on the same project?",
        "Could you guide me on this task?"
      ],
      Extrovert: [
        "How long have you been here?",
        "What's the most interesting project you've worked on?"
      ],
      Funny: [
        "Coffee first or emails first?",
        "Is Monday always this long?"
      ],
      Ambivert: [
        "How did you get into this role?",
        "What's your typical day like?"
      ],
      Calm: [
        "How's your week going?",
        "What do you enjoy most about this team?"
      ]
    }
  };

  const situationKeyMap = {
    college: 'College',
    office: 'Office'
  };

  const personalityKeyMap = {
    introvert: 'Introvert',
    extrovert: 'Extrovert',
    ambivert: 'Ambivert',
    calm: 'Calm',
    funny: 'Funny'
  };

  /* =============================
     HELPERS
  ============================== */

  function getRandomUniqueItems(array, count) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(count, copy.length));
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* =============================
     ICEBREAKER GENERATOR
  ============================== */

  const generateBtn = document.getElementById('generate-icebreaker');
  const loadingIcebreaker = document.getElementById('loading-icebreaker');
  const icebreakerResults = document.getElementById('icebreaker-results');

  function showIcebreakerLoading(show) {
    loadingIcebreaker.classList.toggle('is-visible', show);
  }

  function showIcebreakerResults(items) {
    icebreakerResults.innerHTML = items
      .map(text =>
        `<div class="icebreaker-bubble"><p>${escapeHtml(text)}</p></div>`
      )
      .join('');
    icebreakerResults.classList.add('is-visible');
  }

  function onGenerateIcebreaker() {
    const situation = document.getElementById('situation').value;
    const style = document.getElementById('style').value;

    const situationKey = situationKeyMap[situation];
    const personalityKey = personalityKeyMap[style];

    showIcebreakerLoading(true);

    setTimeout(function () {
      showIcebreakerLoading(false);

      const situationObj = conversationData[situationKey] || {};
      const suggestions = situationObj[personalityKey] || [];

      const randomThree = getRandomUniqueItems(suggestions, 3);

      if (randomThree.length === 0) {
        showIcebreakerResults(["No suggestions available."]);
      } else {
        showIcebreakerResults(randomThree);
      }
    }, 600);
  }

  /* =============================
     REPLY SUGGESTIONS
  ============================== */

  const suggestRepliesBtn = document.getElementById('suggest-replies');
  const loadingReplies = document.getElementById('loading-replies');
  const replyResults = document.getElementById('reply-results');
  const theirReplyInput = document.getElementById('their-reply');

  const NATURAL_FOLLOWUPS = [
    "That's interesting! Tell me more.",
    "How did you get into that?",
    "What do you enjoy most about it?"
  ];

  const EMPATHY_RESPONSES = [
    "That sounds meaningful to you.",
    "I can understand why you'd feel that way."
  ];

  const HUMOR_RESPONSES = [
    "Main character energy right there 😄",
    "Plot twist incoming?"
  ];

  function showRepliesLoading(show) {
    loadingReplies.classList.toggle('is-visible', show);
  }

  function showReplyResults(natural, empathy, humor) {
    replyResults.innerHTML =
      natural.map(n => `<div class="reply-card"><p>${escapeHtml(n)}</p></div>`).join('') +
      `<div class="reply-card"><p>${escapeHtml(empathy)}</p></div>` +
      `<div class="reply-card"><p>${escapeHtml(humor)}</p></div>`;

    replyResults.classList.add('is-visible');
  }

  function onSuggestReplies() {
    const message = theirReplyInput.value.trim();
    if (!message) return;

    showRepliesLoading(true);

    setTimeout(function () {
      showRepliesLoading(false);

      const natural = getRandomUniqueItems(NATURAL_FOLLOWUPS, 3);
      const empathy = getRandomUniqueItems(EMPATHY_RESPONSES, 1)[0];
      const humor = getRandomUniqueItems(HUMOR_RESPONSES, 1)[0];

      showReplyResults(natural, empathy, humor);
    }, 600);
  }

  /* =============================
     PRACTICE CHAT
  ============================== */

  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send');

  function appendBubble(text, isUser) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-bubble ' + (isUser ? 'chat-bubble-user' : 'chat-bubble-ai');
    wrap.innerHTML = `<p>${escapeHtml(text)}</p>`;
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function generateLocalReply(text) {
    const lower = text.toLowerCase();

    if (lower.includes("hi") || lower.includes("hello"))
      return "Hey! Nice to hear from you.";

    if (lower.includes("stress") || lower.includes("tired"))
      return "That sounds tough. Want to talk about it?";

    return "Interesting! Tell me more.";
  }

  function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    appendBubble(text, true);

    setTimeout(function () {
      appendBubble(generateLocalReply(text), false);
    }, 400);
  }

  /* =============================
     INIT
  ============================== */

  function init() {
    initTheme();
    if (themeToggle) themeToggle.addEventListener('click', onThemeToggle);
    if (generateBtn) generateBtn.addEventListener('click', onGenerateIcebreaker);
    if (suggestRepliesBtn) suggestRepliesBtn.addEventListener('click', onSuggestReplies);
    if (chatSendBtn) chatSendBtn.addEventListener('click', sendChatMessage);
    if (chatInput) chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();