// ── SLIDER ──
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function goSlide(n) {
  if (!slides.length || !dots.length) return;
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = n;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

if (slides.length && dots.length) {
  setInterval(() => goSlide((currentSlide + 1) % slides.length), 5000);
}


// ── NAV ──
function toggleMenu() {
  const el = document.getElementById('navLinks');
  if (!el) return;
  el.classList.toggle('open');
}
function closeMenu() {
  const el = document.getElementById('navLinks');
  if (!el) return;
  el.classList.remove('open');
}

// Active nav on scroll (removed for multi-page setup). Each page sets active link via markup.



// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── CHAT BOT ──
let userPhone = '';
let chatHistory = [];
const botReplies = [
  "Thank you for reaching out to Wakavuti Blessed! 🌟 How can we help you today?",
  "We offer psychiatric assessment, counselling, occupational therapy, and much more. Would you like to book an appointment?",
  "Our team is available Monday to Saturday, 8am to 6pm. You can also call us on 0722 908 870.",
  "We have inpatient, outpatient, and residential care options. Which would suit you best?",
  "A member of our team will contact you on the number you provided. Is there anything else we can help with?",
  "Thank you for your message! We'll follow up with you soon. Take care! 💙"
];
let replyIdx = 0;

function unlockChat() {
  const ph = document.getElementById('gatePhone').value.trim();
  if (ph.length < 9) {
    document.getElementById('gateErr').style.display = 'block';
    return;
  }
  userPhone = ph;
  document.getElementById('gateErr').style.display = 'none';
  document.getElementById('phoneGate').style.display = 'none';
  document.getElementById('chatArea').style.display = 'flex';

  // Send phone capture email
  sendEmail(
    'New Chat Started — Wakavuti Website',
    `A visitor started the chat bot.\n\nPhone Number: ${userPhone}\n\nTime: ${new Date().toLocaleString()}`
  );

  addBubble('bot', `Hello! 👋 We have your number (${userPhone}) and will follow up if needed. How can we help you today?`);
}

function addBubble(who, text) {
  const win = document.getElementById('chatWindow');
  const div = document.createElement('div');
  div.className = 'chat-bubble ' + (who === 'bot' ? 'bubble-bot' : 'bubble-user');
  div.textContent = text;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

function sendChat() {
  const inp = document.getElementById('chatInput');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';
  addBubble('user', msg);
  chatHistory.push(msg);

  // Send each message to email
  sendEmail(
    `New Message from Website Chat — Wakavuti`,
    `Phone: ${userPhone}\nMessage: ${msg}\nTime: ${new Date().toLocaleString()}\n\nFull conversation so far:\n${chatHistory.join('\n')}`
  );

  // Bot replies
  setTimeout(() => {
    const reply = botReplies[replyIdx % botReplies.length];
    replyIdx++;
    addBubble('bot', reply);
  }, 800);
}

// ── EMAIL via Web3Forms ──
async function sendEmail(subject, body) {
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: 'REPLACE_WITH_WEB3FORMS_KEY',
        subject: subject,
        from_name: 'Wakavuti Website',
        to: 'samuelgatere941@gmail.com',

        message: body
      })
    });
  } catch(e) { console.log('Email error:', e); }
}

// ── QUICK MESSAGE FORM ──
async function sendQuickMsg() {
  const name = document.getElementById('qName').value.trim();
  const phone = document.getElementById('qPhone').value.trim();
  const msg = document.getElementById('qMsg').value.trim();
  if (!name || !phone || !msg) { alert('Please fill in all fields.'); return; }

  const status = document.getElementById('qStatus');
  await sendEmail(
    `Quick Message from ${name} — Wakavuti Website`,
    `Name: ${name}\nPhone: ${phone}\nMessage: ${msg}\nTime: ${new Date().toLocaleString()}`
  );

  document.getElementById('qName').value = '';
  document.getElementById('qPhone').value = '';
  document.getElementById('qMsg').value = '';
  status.textContent = '✅ Message sent! We will contact you soon.';
  status.style.display = 'block';
  setTimeout(() => status.style.display = 'none', 5000);
}