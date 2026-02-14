/**
 * ConvoCraft – AI Conversation Assistant
 * Frontend-only logic: theme toggle, icebreaker generator, reply suggestions, practice chat, scoring.
 */

(function () {
  'use strict';

  // ----- Theme: localStorage key and DOM -----
  var THEME_STORAGE_KEY = 'convocraft-theme';

  // ----- Conversation dataset: situation → personality → array of icebreakers -----
  const conversationData = {
    "College": {
      "Introvert": [
        "Hey, is this seat taken?",
        "Did you understand that last topic, or should we go over it?",
        "Did you understand today's lecture?",
        "Are you submitting the assignment today?",
        "Are you in the morning or afternoon lab batch?",
        "Do you usually study here?",
        "Are you also in the lab batch?",
        "Do you know when the assignment is due?"
      ],
      "Extrovert": [
        "What did you think about that professor?",
        "Are you planning to attend the fest?",
        "Which club are you in?",
        "What's your major?"
      ],
      "Funny": [
        "Are we pretending to understand this class or just me?",
        "Is this class always this quiet?",
        "Is this the 'confused but surviving' section?",
        "Group study or group suffering?"
      ],
      "Ambivert": [
        "Have you taken this subject before?",
        "Are you thinking about internships already?",
        "Have you worked on any projects outside class?",
        "How are you finding this semester so far?",
        "Did you join any campus groups?"
      ],
      "Calm": [
        "How's your day going?",
        "Do you prefer studying alone or in groups?",
        "Are you from around here?",
        "What subjects do you enjoy most?"
      ]
    },
    "Office": {
      "Introvert": [
        "Hi, are you on the same project?",
        "Is there a template you follow for this?",
        "How do you prioritize tasks here?",
        "Could you guide me on this task?",
        "When is the deadline for this?"
      ],
      "Extrovert": [
        "How long have you been here?",
        "What's something new you've learned recently?",
        "What team are you part of?",
        "What's been the most interesting project you've worked on?",
        "How did you transition into this role?",
        "How's the work culture here?"
      ],
      "Funny": [
        "Is it just me or does Monday feel longer here?",
        "What's the unofficial survival tip here?",
        "Coffee first or emails first?",
        "Is it always this busy at this time of the month?"
      ],
      "Ambivert": [
        "What projects are you currently working on?",
        "How long did it take you to feel comfortable here?",
        "How did you get into this role?",
        "What's your typical day like in this team?"
      ],
      "Calm": [
        "How's your week going?",
        "What do you enjoy most about this team?",
        "What skills matter most in this role?",
        "Do you prefer remote or office days?"
      ]
    },
    "Dating": {
      "Introvert": [
        "What do you usually enjoy doing in your free time?",
        "What do you usually do on weekends?",
        "What kind of movies do you like?",
        "What kind of conversations do you like?"
      ],
      "Extrovert": [
        "What's something you care deeply about?",
        "What's something you're passionate about?",
        "What's the most spontaneous thing you've done?",
        "What kind of people do you feel comfortable around?"
      ],
      "Funny": [
        "What's something people often misunderstand about you?",
        "Serious question — pineapple on pizza?",
        "What's your most useless talent?",
        "What's your go-to way to relax?"
      ],
      "Ambivert": [
        "Do you prefer plans or spontaneous outings?",
        "Do you prefer staying in or going out?",
        "What's been keeping you busy lately?"
      ],
      "Calm": [
        "What does a good weekend look like for you?",
        "What helps you relax after a long day?",
        "What helps you recharge?"
      ]
    },
    "Reconnecting With Friend": {
      "Introvert": [
        "Hey, it's been a while. How have you been?",
        "Are you still in the same city?"
      ],
      "Extrovert": [
        "We should catch up soon. What's new?",
        "What's changed the most for you recently?",
        "Have you picked up any new interests?",
        "Remember our college days?"
      ],
      "Funny": [
        "Did adulthood hit you yet?",
        "Are you still the same, or did adult life win?",
        "What's one update I've missed?",
        "Still the same troublemaker?"
      ],
      "Ambivert": [
        "What's changed the most for you?",
        "Are you still in touch with our old group?",
        "Have you traveled anywhere interesting lately?",
        "What's been your biggest lesson lately?",
        "Are you working on something new?"
      ],
      "Calm": [
        "Are you finding balance between work and life?",
        "How's life been treating you?",
        "Have you picked up any new habits?",
        "Are you happy where you are now?",
        "Did life turn out how you imagined back then?",
        "What's been giving you energy lately?"
      ]
    },
    "Traveling Solo": {
      "Introvert": [
        "Is this seat free?",
        "Do you know what time we reach?",
        "Is this your stop too?",
        "Have you been on this route before?",
        "Is this place easy to get around?"
      ],
      "Extrovert": [
        "What's been the highlight of your trip?",
        "What made you choose this destination?",
        "Any local spots you'd recommend?",
        "Are you traveling for long?",
        "What's the best thing you've tried here?"
      ],
      "Ambivert": [
        "Did you plan everything or keep it flexible?",
        "What kind of experiences are you looking for?",
        "Have you discovered anything unexpected?",
        "Are you more into exploring or relaxing?",
        "Is this your first solo trip?"
      ],
      "Calm": [
        "How are you finding the place so far?",
        "What's been your favorite part quietly?",
        "Is this a break or work-related?",
        "Do you enjoy traveling alone?",
        "What's been most peaceful about this trip?"
      ],
      "Funny": [
        "Are we both pretending we know where we're going?",
        "Did Google Maps confuse you too?",
        "Did you pack smart or overpack?",
        "Is this part of the plan or a plot twist?",
        "Traveling for peace or escaping emails?"
      ]
    },
    "New Neighbor": {
      "Introvert": [
        "Hi, I just moved in next door.",
        "How long have you been here?",
        "What's the garbage timing here?",
        "Is parking usually available?",
        "Is the area generally quiet?"
      ],
      "Extrovert": [
        "What do you like most about living here?",
        "Do neighbors usually interact?",
        "Are there community events?",
        "Any local spots I shouldn't miss?",
        "How's the vibe in this building?"
      ],
      "Ambivert": [
        "Is there anything new residents should know?",
        "Does the building have a residents' group?",
        "How's the maintenance here?",
        "Is this area family-oriented or mixed?",
        "How long have you stayed?"
      ],
      "Calm": [
        "Is this place comfortable to live in?",
        "Do you feel settled here?",
        "Is the area convenient?",
        "How's the overall environment?",
        "Would you recommend staying long-term?"
      ],
      "Funny": [
        "So… peaceful building or hidden drama?",
        "Is there a secret rulebook?",
        "Should I worry about parking wars?",
        "Who's the unofficial building reporter?",
        "Is it quiet here or 'surprisingly lively'?"
      ]
    },
    "Hostel / PG": {
      "Introvert": [
        "Which year are you in?",
        "Is the WiFi working properly today?",
        "What time is dinner usually served?",
        "Are you in this block too?",
        "Do you study here often?"
      ],
      "Extrovert": [
        "How are you finding hostel life so far?",
        "Are you part of any campus groups?",
        "Do people usually hang out in the evenings?",
        "What do you do on weekends here?",
        "Is this your first time staying away from home?"
      ],
      "Ambivert": [
        "How long have you been staying here?",
        "What's the best part about this place?",
        "Is the food manageable?",
        "Do you prefer studying in your room or common areas?",
        "Have you adjusted to hostel routine?"
      ],
      "Calm": [
        "Does it feel comfortable staying here?",
        "Is it easy to focus on studies here?",
        "What's your daily routine like?",
        "Do you feel settled here now?",
        "What helps you manage hostel life better?"
      ],
      "Funny": [
        "Is the mess food good today or experimental?",
        "Do we complain about WiFi daily or weekly?",
        "Is this the quiet floor or the fun one?",
        "How long did it take you to adjust?",
        "Are we surviving or thriving here?"
      ]
    },
    "Gym": {
      "Introvert": [
        "Are you using this machine?",
        "How many sets do you have left?",
        "Is this equipment free?",
        "Do you know the trainer's timing?",
        "Is this your regular time?"
      ],
      "Extrovert": [
        "How long have you been training?",
        "What's your current focus — strength or cardio?",
        "Do you follow a specific program?",
        "Have you seen good results here?",
        "Do you train daily?"
      ],
      "Ambivert": [
        "What split are you following?",
        "Are you prepping for something specific?",
        "Do you prefer mornings or evenings for workouts?",
        "How do you stay consistent?",
        "Do you track your progress?"
      ],
      "Calm": [
        "What keeps you motivated to train regularly?",
        "Do you prefer structured routines?",
        "How do you balance diet and workouts?",
        "How long have you been working out?",
        "What changes have you noticed over time?"
      ],
      "Funny": [
        "Is leg day always this serious?",
        "Are we here to lift or just avoid cardio?",
        "Does everyone avoid the treadmill?",
        "Is rest day the best day?",
        "Are you training hard or just escaping stress?"
      ]
    },
    "Gaming": {
      "Introvert": [
        "What game are you playing these days?",
        "Are you more into single-player or multiplayer?",
        "Do you usually play on PC or console?",
        "Have you finished that new release?",
        "Do you play casually or competitively?"
      ],
      "Extrovert": [
        "What's the best game you've played recently?",
        "Do you squad up regularly?",
        "What got you into gaming?",
        "Which genre do you never get bored of?",
        "Are you grinding ranked or just chilling?"
      ],
      "Ambivert": [
        "What kind of games do you usually stick with?",
        "Do you prefer story-driven or competitive games?",
        "What game surprised you recently?",
        "Do you replay games or move on quickly?",
        "What's your go-to game when you want to relax?"
      ],
      "Calm": [
        "What do you enjoy most about gaming?",
        "Do you play to unwind or for challenge?",
        "How do you decide which games to try?",
        "Do you prefer playing solo or with friends?",
        "What keeps you coming back to certain games?"
      ],
      "Funny": [
        "Are we playing for fun or for revenge?",
        "Be honest — do you blame lag or yourself?",
        "Are you competitive or 'just here for vibes'?",
        "How many unfinished games are in your library?",
        "Do you rage quit or power through?"
      ]
    },
    "Networking Event": {
      "Introvert": [
        "Hi, what brings you here?",
        "Are you focusing on a particular domain?",
        "Which industry are you in?",
        "Have you attended this event before?"
      ],
      "Extrovert": [
        "What kind of projects are you working on?",
        "What's been your biggest learning this year?",
        "What kind of problems are you currently solving?",
        "What's been your biggest professional shift recently?",
        "Are you hiring currently?"
      ],
      "Funny": [
        "So, are you here for networking or snacks?",
        "Are you here to meet people or to observe quietly?",
        "How many business cards have you collected?"
      ],
      "Ambivert": [
        "What inspired you to enter this field?",
        "What's one trend you're paying attention to?",
        "How did you get started in this space?",
        "What trends are you noticing lately?"
      ],
      "Calm": [
        "How did you hear about this event?",
        "What kind of collaborations are you looking for?",
        "What's your long-term focus area?",
        "What's your main focus area?"
      ]
    }
  };

  // Map dropdown option values to conversationData keys.
  const situationKeyMap = {
    college: 'College',
    office: 'Office',
    dating: 'Dating',
    reconnecting: 'Reconnecting With Friend',
    'traveling-solo': 'Traveling Solo',
    'new-neighbor': 'New Neighbor',
    'hostel-pg': 'Hostel / PG',
    gym: 'Gym',
    gaming: 'Gaming',
    networking: 'Networking Event'
  };
  const personalityKeyMap = {
    introvert: 'Introvert',
    extrovert: 'Extrovert',
    ambivert: 'Ambivert',
    calm: 'Calm',
    funny: 'Funny'
  };

  // ----- Hardcoded data: reply suggestions -----
  const NATURAL_FOLLOWUPS = [
    "That's really interesting—how did you get into that?",
    "I'd love to hear more about that.",
    "What do you like most about it?",
    "That makes sense. What's been the biggest challenge?",
    "How long have you been doing that?",
    "Do you have any tips for someone who's curious about that?",
    "What's the best part of your day when you're doing that?",
    "I've always wondered about that. What's it like?",
    "That sounds rewarding. What got you started?",
  ];

  const EMPATHY_RESPONSES = [
    "That sounds tough. I hear you.",
    "It's okay to feel that way. Thanks for sharing.",
    "I can imagine that's not easy. How are you holding up?",
    "That must be really hard. I'm here if you want to talk.",
    "I get it. Sometimes we just need to vent.",
  ];

  const HUMOR_RESPONSES = [
    "Same, but make it iced coffee and a nap.",
    "Honestly, mood. We're all just figuring it out.",
    "I feel that. My life is 90% improv at this point.",
    "Relatable. I've accepted chaos as my co-pilot.",
    "That tracks. I'm convinced adulthood is a group project nobody signed up for.",
  ];

  // ----- DOM references -----
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const navLinks = document.querySelectorAll('.nav-link, .hero-cta');
  const generateBtn = document.getElementById('generate-icebreaker');
  const loadingIcebreaker = document.getElementById('loading-icebreaker');
  const icebreakerResults = document.getElementById('icebreaker-results');
  const suggestRepliesBtn = document.getElementById('suggest-replies');
  const loadingReplies = document.getElementById('loading-replies');
  const replyResults = document.getElementById('reply-results');
  const theirReplyInput = document.getElementById('their-reply');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send');
  const scoringPanel = document.getElementById('scoring-panel');
  const scoreBars = {
    confidence: document.getElementById('score-confidence'),
    empathy: document.getElementById('score-empathy'),
    curiosity: document.getElementById('score-curiosity'),
  };
  const scoreValues = {
    confidence: document.getElementById('score-confidence-value'),
    empathy: document.getElementById('score-empathy-value'),
    curiosity: document.getElementById('score-curiosity-value'),
  };

  // ----- Theme: apply saved preference on load and handle toggle -----
  function applyTheme(isDark) {
    if (isDark) {
      body.classList.add('dark-mode');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        themeToggle.setAttribute('title', 'Switch to light mode');
      }
    } else {
      body.classList.remove('dark-mode');
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        themeToggle.setAttribute('title', 'Switch to dark mode');
      }
    }
  }

  function initTheme() {
    var saved = localStorage.getItem(THEME_STORAGE_KEY);
    var isDark = saved === 'dark';
    applyTheme(isDark);
  }

  function onThemeToggle() {
    var isDark = body.classList.toggle('dark-mode');
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    applyTheme(isDark);
  }

  // ----- Helpers -----
  /**
   * Returns an array of up to `count` unique random items from `array`.
   * Does not mutate the original array.
   */
  function getRandomUniqueItems(array, count) {
    if (!Array.isArray(array) || array.length === 0 || count <= 0) return [];
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(count, copy.length));
  }

  /** Alias for reply suggestions: pick n random unique items. */
  function pickRandom(arr, n) {
    return getRandomUniqueItems(arr, n);
  }

  // ----- Smooth scroll for nav and CTA -----
  function initSmoothScroll() {
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const id = href.slice(1);
          const target = document.getElementById(id);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ----- Icebreaker generator -----
  function showIcebreakerLoading(show) {
    loadingIcebreaker.classList.toggle('is-visible', show);
    loadingIcebreaker.setAttribute('aria-hidden', !show);
    if (show) {
      icebreakerResults.classList.remove('is-visible');
      icebreakerResults.setAttribute('aria-hidden', true);
    }
  }

  function showIcebreakerResults(items) {
    loadingIcebreaker.classList.remove('is-visible');
    loadingIcebreaker.setAttribute('aria-hidden', true);
    icebreakerResults.innerHTML = items
      .map(function (text) {
        return '<div class="icebreaker-bubble"><p>' + escapeHtml(text) + '</p></div>';
      })
      .join('');
    icebreakerResults.classList.add('is-visible');
    icebreakerResults.setAttribute('aria-hidden', false);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Generate icebreakers: read selected context and personality, fetch array,
   * pick 3 unique items, display (or show empty state).
   */
  async function onGenerateIcebreaker() {
  const situationSelect = document.getElementById('situation');
  const styleSelect = document.getElementById('style');

  const contextValue = (situationSelect && situationSelect.value) || 'college';
  const personalityValue = (styleSelect && styleSelect.value) || 'introvert';

  showIcebreakerLoading(true);

  try {
    const response = await fetch("http://localhost:5001/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        context: contextValue,
        personality: personalityValue
      })
    });

    const data = await response.json();

    // Split Gemini text into lines
    const lines = data.output
      .split("\n")
      .filter(line => line.trim() !== "");

    showIcebreakerResults(lines);

  } catch (error) {
    showIcebreakerResults(["Error generating suggestions."]);
    console.error(error);
  }
}

  // ----- Suggest replies -----
  function showRepliesLoading(show) {
    loadingReplies.classList.toggle('is-visible', show);
    loadingReplies.setAttribute('aria-hidden', !show);
    if (show) {
      replyResults.classList.remove('is-visible');
      replyResults.setAttribute('aria-hidden', true);
    }
  }

  function showReplyResults(natural, empathy, humor) {
    loadingReplies.classList.remove('is-visible');
    loadingReplies.setAttribute('aria-hidden', true);
    const cards = []
      .concat(
        natural.map(function (text) {
          return { text: text, tag: 'Follow-up' };
        }),
        [{ text: empathy, tag: 'Empathy' }],
        [{ text: humor, tag: 'Light humor' }]
      )
      .map(function (item) {
        return (
          '<div class="reply-card">' +
          '<span class="reply-tag">' +
          escapeHtml(item.tag) +
          '</span><p>' +
          escapeHtml(item.text) +
          '</p></div>'
        );
      });
    replyResults.innerHTML = cards.join('');
    replyResults.classList.add('is-visible');
    replyResults.setAttribute('aria-hidden', false);
  }

  async function onSuggestReplies() {
  const userMessage = theirReplyInput.value.trim();

  if (!userMessage) return;

  showRepliesLoading(true);

  try {
    const response = await fetch("http://localhost:5001/suggest-replies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage
      })
    });

    const data = await response.json();

    const lines = data.output
      .split("\n")
      .filter(line => line.trim() !== "");

    const natural = lines.slice(0, 3);
    const empathy = lines[3] || "";
    const humor = lines[4] || "";

    showReplyResults(natural, empathy, humor);

  } catch (error) {
    showReplyResults(["Error generating replies."], "", "");
    console.error(error);
  }
}

  // ----- Practice chat + scoring -----
  let userMessageCount = 0;
  const USER_MESSAGE_THRESHOLD = 3;

  function sendChatMessage() {
    const lower = userText.toLowerCase().trim();
    if (/\b(hi|hey|hello|howdy)\b/.test(lower)) {
      return "Hey! Good to hear from you. What's on your mind?";
    }
    if (/\b(stress|stressed|anxious|worried|overwhelm|tired|hard)\b/.test(lower)) {
      return "That sounds really draining. It's okay to take things one step at a time. Want to talk about it, or would you rather switch to something lighter?";
    }
    if (/\b(thanks|thank you|thx)\b/.test(lower)) {
      return "Anytime! Keep practicing—you're doing great.";
    }
    return "That's a good point. I'm curious—what made you think of that? Or we can switch to something else you'd like to try.";
  }

  function appendBubble(text, isUser) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-bubble ' + (isUser ? 'chat-bubble-user' : 'chat-bubble-ai');
    const p = document.createElement('p');
    p.textContent = text;
    wrap.appendChild(p);
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showScoringPanel() {
    const confidence = 60 + Math.floor(Math.random() * 36);
    const empathy = 60 + Math.floor(Math.random() * 36);
    const curiosity = 60 + Math.floor(Math.random() * 36);

    scoringPanel.classList.add('is-visible');
    scoringPanel.setAttribute('aria-hidden', false);

    // Trigger reflow so transition runs
    scoreBars.confidence.offsetHeight;
    scoreBars.confidence.style.width = confidence + '%';
    scoreBars.empathy.style.width = empathy + '%';
    scoreBars.curiosity.style.width = curiosity + '%';

    scoreValues.confidence.textContent = confidence + '%';
    scoreValues.empathy.textContent = empathy + '%';
    scoreValues.curiosity.textContent = curiosity + '%';
  }

  function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    appendBubble(text, true);
    userMessageCount += 1;

    // Simulate short delay before AI reply
    setTimeout(async function () {
  try {
    const response = await fetch("http://localhost:5001/practice-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();
    appendBubble(data.reply, false);

  } catch (error) {
    appendBubble("Hmm, something went wrong. Try again.", false);
    console.error(error);
  }
}, 400);

    if (userMessageCount >= USER_MESSAGE_THRESHOLD && !scoringPanel.classList.contains('is-visible')) {
      setTimeout(showScoringPanel, 600);
    }
  }

  function onChatSend() {
    sendChatMessage();
  }

  function onChatKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  }

  // ----- Event binding -----
  function init() {
    initTheme();
    initSmoothScroll();
    if (themeToggle) themeToggle.addEventListener('click', onThemeToggle);
    if (generateBtn) generateBtn.addEventListener('click', onGenerateIcebreaker);
    if (suggestRepliesBtn) suggestRepliesBtn.addEventListener('click', onSuggestReplies);
    if (chatSendBtn) chatSendBtn.addEventListener('click', onChatSend);
    if (chatInput) chatInput.addEventListener('keydown', onChatKeydown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  const token = localStorage.getItem('token');

if (!token) {
  // Not logged in, redirect to login
  window.location.href = 'login.html';
}

// Add logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  window.location.href = 'login.html';
}
})();
