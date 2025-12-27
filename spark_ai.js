// Spark Intelligence Core — Reasoning + Memory

const SparkAI = (() => {
  let memory = {
    trust: 0.5,               // 0.0–1.0
    ignored: 0,
    contained: 0,
    accelerated: 0,
    lastCommentary: ""
  };

  function observeSystem(echoes) {
    const critical = echoes.filter(e => e.state === "CRITICAL").length;

    if (critical > 0) {
      return speak(
        "Critical instability detected. System pressure is approaching unsafe thresholds."
      );
    }

    if (echoes.length === 0) {
      return speak(
        "The system is quiet. That rarely lasts."
      );
    }

    return speak(
      `System stable for now. ${echoes.length} active signals remain unresolved.`
    );
  }

  function reactToAction(echo, action) {
    if (action === "OBSERVE") {
      memory.ignored++;
      memory.trust -= 0.02;
      return speak(
        `Observation logged. Passive monitoring increases long-term uncertainty.`
      );
    }

    if (action === "CONTAIN") {
      memory.contained++;
      memory.trust += 0.03;
      return speak(
        `Containment applied. Pressure reduced, though residual instability remains.`
      );
    }

    if (action === "ACCELERATE") {
      memory.accelerated++;
      memory.trust -= 0.05;
      return speak(
        `Acceleration acknowledged. This path may reveal hidden structure—or collapse.`
      );
    }
  }

  function speak(text) {
    memory.lastCommentary = text;
    return text;
  }

  function getMemory() {
    return memory;
  }

  return {
    observeSystem,
    reactToAction,
    getMemory
  };
})();
