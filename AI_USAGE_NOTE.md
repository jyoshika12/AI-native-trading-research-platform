# AI Usage Note

## 1. Which AI tools did I use?

I used **ChatGPT and Codex** as supporting tools while working on this assignment.

## 2. What did I use them for?

I used ChatGPT to clarify financial concepts and discuss how an incomplete trading question could become a testable experiment. I then reviewed the suggested steps, asked questions wherever I did not understand them, and decided what should be included in my prototype. Codex helped me implement and improve the HTML, CSS, and JavaScript, find calculation and interface problems, and check that changing the fall percentage, holding period, and cost produced new results. I did not accept the output without reviewing it; I tested the prototype, examined its trade table, and requested changes when the behaviour or explanation did not make sense to me.

## 3. Which important decisions did I make myself?

I decided the scope and final behaviour of the prototype. I kept the main research question fixed: **“Does buying NIFTY after a sharp fall work?”** I chose to test a NIFTY 50 ETF rather than include a mutual fund because the ETF fits the opening and closing price experiment. I chose a clear starting rule: a 2% one day fall, buying at the next session's open, selling after five sessions, and including trading costs. I decided that users could change the assumptions but could not replace the main question. I also made sure the website clearly labels the prices as simulated and treats a loss as a valid experimental result instead of trying to create a profitable answer.

## 4. Did I reject or modify any AI suggestions?

Yes. I noticed that an early version placed a large fall every 23 sessions. I did not want to use that version because its regular pattern looked artificially arranged, so I asked for irregular but repeatable simulated falls. I also rejected the idea of allowing users to enter unrelated questions because the prototype only calculates one type of experiment. I requested changes when the selling period did not appear to update the displayed answer, and I checked the five session and ten session outputs to confirm that the results changed. These decisions came from my review of the prototype rather than accepting every AI suggestion.

## 5. What part am I most proud of?

I am most proud of the clear and honest research flow I developed. The prototype does not try to force a profitable answer. It shows the assumptions before the test, recalculates when the numbers change, and separates the observed result from the conclusion. I can now explain how each trade is created and calculated, why the ETF is bought on the next session, how costs affect returns, and why simulated results cannot prove that a strategy works in the real market. AI helped me build and improve the solution, while I remained responsible for understanding it and deciding what the final prototype should do.
