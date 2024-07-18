const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/stream', (req, res) => {
  const message = "Yield Curve Central is a one-stop solution for your analysis of the US Treasury yield curve. We're your open-source documentation for understanding how the Fed affects interest rates and how interest rates affect the economy.";
  let index = 0;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    if (index < message.length) {
      res.write(`data: ${message[index]}\n\n`);
      index++;
    } else {
      clearInterval(interval);
      res.end();
    }
  }, 500); // Adjust the interval for faster or slower streaming
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

