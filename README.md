# After the Fall

A small, local web prototype for turning “Does buying NIFTY after a sharp fall work?” into a visible, testable rule. It follows the assignment journey: **Ask → Clarify → Define → Test → Learn**.

## Run locally

Open `index.html` in a modern browser. No install, account, API key, or internet connection is needed. Select **Ask this question** to begin. The question is fixed for this prototype. Review or change the fall threshold, holding period, and estimated cost, then select **Use these assumptions and run the example**.

## How it works

`index.html` contains the single-page interface, `styles.css` contains the styling, and `app.js` creates a reproducible **simulated** series of 360 NIFTY and ETF price sessions and calculates example trades. Sessions are labelled Day 1–360 rather than assigned real calendar dates. No real market data is used. A seeded random generator gives each session a small chance of a larger fall, so falls occur at irregular intervals but the same example appears on every run.

The signal occurs when the simulated NIFTY closing value falls by at least the selected percentage from the previous close. The example buys a simulated NIFTY 50 ETF at the **next session's open** and sells at the **close after the selected number of sessions**. It deducts the selected total round trip cost from each gross return. Another signal is skipped while a trade is open.

The result shows the number of qualifying trades, the share that have positive net returns, average net return, and individual trades. For context, it also compares the strategy's average with the average of **all possible ETF holding windows of the same length in this simulated sample**. That comparison is descriptive, not proof of an advantage.

## Main choices and limits

- The first version tests an ETF only. A NIFTY 50 index mutual fund would require different NAV based pricing rules.
- A 2% one-session fall, buying at the next open, and selling five sessions after entry are suggested defaults. The user can change the threshold and holding period.
- Costs are a user visible estimate, not a claim about any broker's actual charges.
- Simulated results show the workflow but **cannot answer whether this idea works in the real market**. A real study would need sourced, adjusted historical data, exchange calendars, an identified ETF, more accurate trading costs, and careful comparison against alternatives.

See [THINKING_NOTE.md](THINKING_NOTE.md) for the reasoning behind the experiment.

## AI use and next improvements

ChatGPT/Codex helped explain the assignment, draft the Thinking Note, and implement and check this prototype. The chosen ETF only scope and proposed research rules were discussed with and accepted by the student; the final AI Usage Note should describe any further independent changes and decisions honestly. Next, replace the invented data with documented real NIFTY and ETF prices, add a proper exchange calendar, and test whether results hold across different market periods.
