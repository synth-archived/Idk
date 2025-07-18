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

  try {
    const geminiResponse = await queryGeminiAPI(transcript);
    speak(geminiResponse);
  } catch (error) {
    console.error("Gemini API error:", error);
    speak("Something went wrong talking to Gemini.");
  }
};

function speak(text) {
  if (!text) return;
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.lang = "en-US";
  synth.cancel(); // Fixes delay issues
  synth.speak(utterThis);
  responseEl.textContent = `Nyra says: ${text}`;
}

async function queryGeminiAPI(input) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBIOqvAwqp-uatK8dFyg_cvsihS76MN9Qw";

  const body = {
    contents: [{ parts: [{ text: input }] }]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  console.log("Gemini Response:", data);

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I'm not sure how to respond to that."
  );
}
