window.onerror = function (msg, src, line, col, err) {
  console.error("Caught JS error:", msg);
};

const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-theme');
  themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  const isDark = body.classList.contains('dark-theme');
  themeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    navLinks.classList.remove('active');
  });
});

const chatBubble = document.querySelector('.chat-bubble');
const chatbotOverlay = document.querySelector('.chatbot-overlay');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotForm = document.querySelector('#chatbot-form');
const chatbotBody = document.querySelector('.chatbot-body');

const myFullName = "John Doe";
const myDescription = "I am a software engineer with a passion for blending technology and creativity through a variety of hobbies that keep me engaged and inspired. I love diving into open-source projects on GitHub, where I tinker with code, fix bugs, or add new features to tools I care about. Building side projects, like crafting apps or experimenting with new web frameworks, fuels my curiosity and lets me explore ideas outside of work. When I’m not coding, you might find me gaming, especially strategy or indie titles, or even dabbling in game modding for fun. I also enjoy writing tech blogs to share my experiences with new tools or coding techniques, connecting with the developer community. For a hands-on challenge, I play with Arduino and Raspberry Pi to create IoT gadgets or automate parts of my home. To unwind, I read sci-fi novels or tech books, like Clean Code, and often head out for hikes to clear my mind and soak in nature. These hobbies keep my skills sharp and my life balanced, reflecting both my love for tech and my need for creative outlets.";

chatBubble.addEventListener('click', () => {
  chatbotOverlay.classList.toggle('active');
  if (chatbotOverlay.classList.contains('active')) {
    chatbotBody.innerHTML = `
      <div class="chat-message ai">
        <div class="message">Hi, I am ${myFullName}, what do you want to know about me?</div>
      </div>
    `;
  }
});

chatbotClose.addEventListener('click', () => {
  chatbotOverlay.classList.remove('active');
});

const GEMINI_API_KEY = 'AIzaSyDxyWNLUrRf1F1HbK5zFl8mPv23P7BRShc';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

chatbotForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = chatbotForm.querySelector('input');
  const messageText = input.value.trim();
  if (!messageText) return;

  chatbotBody.innerHTML += `
    <div class="chat-message user">
      <div class="message">${messageText}</div>
    </div>
  `;

  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatbotBody.appendChild(typing);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;

  try {
    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        contents: [{
            parts: [{
            text: `User: ${messageText}\nAbout me: ${myDescription}\nReply like it's John Doe speaking.`
            }]
        }]
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";


    typing.remove();
    chatbotBody.innerHTML += `
      <div class="chat-message ai">
        <div class="message">${reply}</div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    typing.remove();
    chatbotBody.innerHTML += `
      <div class="chat-message ai">
        <div class="message">Oops! Something went wrong.</div>
      </div>
    `;
  }

  input.value = '';
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
});

const typedTextElement = document.querySelector('.typed-text');
const phrases = [
  "Full-Stack Developer",
  "Tech Blogger",
  "Open Source Contributor",
  "Creative Thinker"
];

let currentPhrase = 0;
let currentChar = 0;
let isDeleting = false;

function typeEffect() {
  const current = phrases[currentPhrase];
  typedTextElement.textContent = current.substring(0, currentChar);

  if (!isDeleting && currentChar < current.length) {
    currentChar++;
    setTimeout(typeEffect, 100);
  } else if (isDeleting && currentChar > 0) {
    currentChar--;
    setTimeout(typeEffect, 50);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) currentPhrase = (currentPhrase + 1) % phrases.length;
    setTimeout(typeEffect, 1000);
  }
}

typeEffect();