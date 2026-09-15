"use strict";

function generateSample() {
  let seed = 20260913;
  const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  let niftyClose = 22000;
  let etfClose = 220;
  const sessions = [];

  for (let index = 0; index < 360; index++) {
    const largerFall = index > 0 && random() < 0.06;
    const niftyChange = largerFall
      ? -(0.021 + random() * 0.018)
      : (random() - 0.48) * 0.023;
    const etfOpen = etfClose * (1 + (random() - 0.5) * 0.008);
    niftyClose *= 1 + niftyChange;
    etfClose *= 1 + niftyChange + (random() - 0.5) * 0.002;
    sessions.push({ day: index + 1, niftyClose, etfOpen, etfClose });
  }
  return sessions;
}

function runBacktest(sessions, fallThreshold, holdSessions, costPercent) {
  const trades = [];
  let lastExitIndex = -1;

  for (let signalIndex = 1; signalIndex + 1 + holdSessions < sessions.length; signalIndex++) {
    const fallPercent = (sessions[signalIndex].niftyClose / sessions[signalIndex - 1].niftyClose - 1) * 100;
    if (fallPercent > -fallThreshold || signalIndex <= lastExitIndex) continue;

    const buyIndex = signalIndex + 1;
    const sellIndex = buyIndex + holdSessions;
    const buyPrice = sessions[buyIndex].etfOpen;
    const sellPrice = sessions[sellIndex].etfClose;
    const grossPercent = (sellPrice / buyPrice - 1) * 100;
    const netPercent = grossPercent - costPercent;

    trades.push({
      signalDay: sessions[signalIndex].day,
      fallPercent,
      buyDay: sessions[buyIndex].day,
      buyPrice,
      sellDay: sessions[sellIndex].day,
      sellPrice,
      grossPercent,
      netPercent
    });
    lastExitIndex = sellIndex; 
  }

  const wins = trades.filter(trade => trade.netPercent > 0).length;
  const average = trades.length
    ? trades.reduce((sum, trade) => sum + trade.netPercent, 0) / trades.length
    : null;
  const ordinaryReturns = [];
  for (let buyIndex = 1; buyIndex + holdSessions < sessions.length; buyIndex++) {
    const buyPrice = sessions[buyIndex].etfOpen;
    const sellPrice = sessions[buyIndex + holdSessions].etfClose;
    ordinaryReturns.push((sellPrice / buyPrice - 1) * 100 - costPercent);
  }
  const ordinaryAverage = ordinaryReturns.reduce((sum, value) => sum + value, 0) / ordinaryReturns.length;
  return { trades, wins, average, ordinaryAverage };
}

if (typeof module !== "undefined") module.exports = { generateSample, runBacktest };

if (typeof document !== "undefined") {
  const sessions = generateSample();
  const threshold = document.getElementById("threshold");
  const hold = document.getElementById("hold");
  const cost = document.getElementById("cost");
  const run = document.getElementById("run");
  const results = document.getElementById("results");
  const ask = document.getElementById("ask");

  const displayPercent = value => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  const displayPrice = value => `₹${value.toFixed(2)}`;

  function readRules() {
    const numericInputsPresent = [threshold, hold, cost].every(input => input.value.trim() !== "");
    const fallThreshold = Number(threshold.value);
    const holdSessions = Number(hold.value);
    const costPercent = Number(cost.value);
    const numbersValid = numericInputsPresent
      && Number.isFinite(fallThreshold) && fallThreshold >= 0.5 && fallThreshold <= 10
      && Number.isInteger(holdSessions) && holdSessions >= 1 && holdSessions <= 20
      && Number.isFinite(costPercent) && costPercent >= 0 && costPercent <= 5;

    document.getElementById("input-error").hidden = numbersValid;
    run.disabled = !numbersValid;
    return run.disabled ? null : { fallThreshold, holdSessions, costPercent };
  }

  function updateDefinition() {
    const rules = readRules();
    document.getElementById("rule-signal").textContent = rules
      ? `NIFTY 50 closes down ${rules.fallThreshold}% or more in one session`
      : "Waiting for valid choices";
    document.getElementById("rule-sell").textContent = rules
      ? `At close, ${rules.holdSessions} sessions after buying`
      : "Waiting for valid choices";
    document.getElementById("rule-cost").textContent = rules
      ? `${rules.costPercent.toFixed(2)}% total, deducted from each trade`
      : "Waiting for valid choices";
    document.getElementById("rule-hypothesis").textContent = rules
      ? `After a ${rules.fallThreshold}% fall, buying the ETF has a positive average return after ${rules.holdSessions} sessions and costs`
      : "Waiting for valid choices";
  }

  function renderResults() {
    const rules = readRules();
    if (!rules) return;
    const { trades, wins, average, ordinaryAverage } = runBacktest(
      sessions, rules.fallThreshold, rules.holdSessions, rules.costPercent
    );

    document.getElementById("tested-rule").textContent =
      `Rule tested: after a NIFTY 50 fall of at least ${rules.fallThreshold}%, buy the ETF at the next session's open and sell ${rules.holdSessions} sessions later at the close. Deduct ${rules.costPercent.toFixed(2)}% in assumed total costs.`;
    document.getElementById("trade-count").textContent = String(trades.length);
    document.getElementById("wins").textContent = trades.length
      ? `${wins} of ${trades.length} (${Math.round(wins / trades.length * 100)}%)`
      : "0";
    const averageElement = document.getElementById("average");
    averageElement.textContent = average === null ? "—" : displayPercent(average);
    averageElement.className = average === null ? "" : average >= 0 ? "positive" : "negative";
    const baselineElement = document.getElementById("baseline");
    baselineElement.textContent = displayPercent(ordinaryAverage);
    baselineElement.className = ordinaryAverage >= 0 ? "positive" : "negative";

    document.getElementById("observation").textContent = trades.length
      ? `In these invented prices, ${wins} of ${trades.length} trades gained after costs. Their average return was ${displayPercent(average)}; ordinary ${rules.holdSessions}-session holding periods averaged ${displayPercent(ordinaryAverage)}. These are averages per trade, not a return promised to a person.`
      : "No simulated session met this fall rule. There are no matching trades to evaluate.";
    document.getElementById("conclusion").textContent = trades.length
      ? `This only demonstrates the calculation. Because the prices were invented, it does not show whether the rule works with real money. ${trades.length} example trades would also be too little evidence for a strong general claim.`
      : "This sample cannot tell us how the rule performs when there are no matching trades. We would need a different or larger dataset.";

    const detail = document.getElementById("trade-detail");
    detail.hidden = trades.length === 0;
    if (trades.length) {
      const first = trades[0];
      document.getElementById("trade-example").textContent =
        `On simulated Day ${first.signalDay}, NIFTY fell ${Math.abs(first.fallPercent).toFixed(2)}%. The rule buys the ETF on Day ${first.buyDay} at ${displayPrice(first.buyPrice)} and sells on Day ${first.sellDay} at ${displayPrice(first.sellPrice)}. Price change: ${displayPercent(first.grossPercent)}. Minus ${rules.costPercent.toFixed(2)}% assumed costs = ${displayPercent(first.netPercent)} net return.`;
    }

    const tbody = document.getElementById("trade-rows");
    tbody.replaceChildren();
    for (const trade of trades) {
      const tr = document.createElement("tr");
      const cells = [
        `Day ${trade.signalDay}`,
        `${trade.fallPercent.toFixed(2)}%`,
        `Day ${trade.buyDay}`,
        displayPrice(trade.buyPrice),
        `Day ${trade.sellDay}`,
        displayPrice(trade.sellPrice),
        displayPercent(trade.netPercent)
      ];
      for (const text of cells) {
        const td = document.createElement("td");
        td.textContent = text;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    results.hidden = false;
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  ask.addEventListener("click", () => {
    document.getElementById("clarification").hidden = false;
    document.getElementById("definition").hidden = false;
    document.getElementById("asked-status").hidden = false;
    ask.setAttribute("aria-expanded", "true");
    ask.hidden = true;
    threshold.focus();
  });

  for (const input of [threshold, hold, cost]) {
    input.addEventListener("input", () => {
      results.hidden = true; 
      updateDefinition();
    });
  }
  run.addEventListener("click", renderResults);
  updateDefinition();
}
