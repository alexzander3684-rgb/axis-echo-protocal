// CLOCK
setInterval(() => {
  const c = document.getElementById("clock");
  if (c) c.textContent = new Date().toLocaleTimeString("en-US",{hour12:false});
}, 1000);

// LOAD DEPENDENCIES
["echo_engine.js", "spark_ai.js", "access_control.js"].forEach(src => {
  const s = document.createElement("script");
  s.src = src;
  document.body.appendChild(s);
});

let audioUnlocked = false;
let audioCtx = null;

function unlockAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  audioUnlocked = true;
}

function speakSpark(text) {
  if (!audioUnlocked) return;

  fetch("http://127.0.0.1:5001/spark/voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  })
    .then(r => r.blob())
    .then(b => {
      const audio = new Audio(URL.createObjectURL(b));
      audio.play();
    });
}

function initGame() {
  const echoList = document.getElementById("echoList");
  const archiveList = document.getElementById("archiveList");
  const select = document.getElementById("echoSelect");
  const sparkText = document.getElementById("sparkStatus");

  if (!AccessControl.hasFullAccess()) {
    sparkText.textContent =
      "Welcome, operator. This system is live. Access is limited during pre-launch.";
  }

  EchoEngine.start((echoes) => {
    if (echoList) {
      echoList.innerHTML = echoes.map(e =>
        `<div>${e.id} — ${e.state} | Pressure ${e.pressure}</div>`
      ).join("");
    }

    if (archiveList) {
      archiveList.innerHTML = echoes.map(e =>
        `<div>${e.id} — ${e.state} | Actions: ${e.history.join(", ")}</div>`
      ).join("");
    }

    if (select) {
      select.innerHTML = echoes.map(e =>
        `<option value="${e.id}">${e.id}</option>`
      ).join("");
    }

    const commentary = SparkAI.observeSystem(echoes);
    sparkText.textContent = commentary;
    speakSpark(commentary);
  });
}

// OPERATOR ACTION
function doAction(action) {
  unlockAudio();

  const select = document.getElementById("echoSelect");
  const sparkText = document.getElementById("sparkStatus");
  if (!select || !select.value) return;

  if (!AccessControl.hasFullAccess()) {
    sparkText.textContent =
      "Training action acknowledged. Full control unlocks after authorization.";
    speakSpark(sparkText.textContent);
    AccessControl.completeTutorial();
    return;
  }

  const echo = EchoEngine.applyAction(select.value, action);
  if (echo) {
    const response = SparkAI.reactToAction(echo, action);
    sparkText.textContent = response;
    speakSpark(response);
  }
}

// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

window.onload = initGame;
