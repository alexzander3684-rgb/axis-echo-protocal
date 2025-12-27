// Echo Protocol — Core Lifecycle Engine

const EchoEngine = (() => {
  let echoes = [];
  let tickInterval = null;

  function createEcho() {
    const echo = {
      id: "ECHO-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
      pressure: Math.floor(Math.random() * 30) + 20,
      volatility: Math.random().toFixed(2),
      state: "EMERGING",
      createdAt: Date.now()
    };
    echoes.push(echo);
    return echo;
  }

  function updateEcho(echo) {
    echo.pressure += Math.floor(Math.random() * 6);
    if (echo.pressure > 70) echo.state = "ESCALATING";
    if (echo.pressure > 100) echo.state = "CRITICAL";
  }

  function tick() {
    if (Math.random() < 0.3) createEcho();
    echoes.forEach(updateEcho);
    return echoes;
  }

  function start(onUpdate) {
    if (tickInterval) return;
    tickInterval = setInterval(() => {
      const state = tick();
      onUpdate(state);
    }, 4000);
  }

  function getEchoes() {
    return echoes;
  }

  return { start, getEchoes };
})();
