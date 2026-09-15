"use strict";

const assert = require("node:assert/strict");
const { generateSample, runBacktest } = require("./app.js");

const sessions = generateSample();
assert.equal(sessions.length, 360);
assert.deepEqual(sessions, generateSample(), "the invented sample should be reproducible");

function check(holdSessions) {
  const result = runBacktest(sessions, 2, holdSessions, 0.2);
  assert.ok(result.trades.length > 0, "the example should have trades to inspect");

  for (const trade of result.trades) {
    assert.ok(trade.fallPercent <= -2);
    assert.equal(trade.buyDay, trade.signalDay + 1);
    assert.equal(trade.sellDay, trade.buyDay + holdSessions);
    assert.ok(Math.abs(trade.netPercent - (trade.grossPercent - 0.2)) < 1e-10);
  }
  for (let i = 1; i < result.trades.length; i++) {
    assert.ok(result.trades[i].signalDay > result.trades[i - 1].sellDay);
  }

  const mean = result.trades.reduce((sum, trade) => sum + trade.netPercent, 0) / result.trades.length;
  assert.ok(Math.abs(result.average - mean) < 1e-10);
  const ordinaryReturns = sessions.slice(1, -holdSessions).map((session, index) =>
    (sessions[index + 1 + holdSessions].etfClose / session.etfOpen - 1) * 100 - 0.2
  );
  const ordinaryMean = ordinaryReturns.reduce((sum, value) => sum + value, 0) / ordinaryReturns.length;
  assert.ok(Math.abs(result.ordinaryAverage - ordinaryMean) < 1e-10);
  console.log(`${holdSessions} sessions: ${result.trades.length} trades, ${result.wins} wins, ${result.average.toFixed(2)}% average; signals on days ${result.trades.map(trade => trade.signalDay).join(", ")}`);
}

check(5);
check(10);

const signals = runBacktest(sessions, 2, 5, 0.2).trades.map(trade => trade.signalDay);
const gaps = signals.slice(1).map((day, index) => day - signals[index]);
assert.ok(new Set(gaps).size > 1, "large falls should not appear on a fixed schedule");
