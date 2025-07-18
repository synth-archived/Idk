const speakButton = document.getElementById("speakButton");
const responseEl = document.getElementById("response");

const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

speakButton.addEventListener("click", () => {
  recognition.start();
});

recognition.onresult = async (event) => {
  const transcript = event.results[0][0].transcript;
  responseEl.textContent = `You said: ${transcript}`;
  const geminiResponse = await queryGeminiAPI(transcript);
  speak(geminiResponse);
};

function speak(text) {
  const utterThis = new SpeechSynthesisUtterance(text);
  synth.speak(utterThis);
  responseEl.textContent = `Nyra says: ${text}`;
}

async function queryGeminiAPI(input) {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBIOqvAwqp-uatK8dFyg_cvsihS76MN9Qw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: input }] }]
    })
  });
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
}