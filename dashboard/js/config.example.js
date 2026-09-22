/* =========================================================================
   AquaYield AI — config template.

   Copy this file to js/config.js (which is git-ignored) and paste a real
   Groq API key into it. Get one (or a fresh one, if an old key ever
   leaked) at https://console.groq.com/keys

   Do NOT put a real key in THIS file — js/config.example.js is committed
   to the repo and is meant to stay a safe placeholder.
   ========================================================================= */
window.AQUAYIELD_AI_CONFIG = {
  apiKey: 'PASTE_YOUR_GROQ_API_KEY_HERE',
  model: 'openai/gpt-oss-120b' // current production general-purpose model on Groq
};
