const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const port = 3000;

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/api/rates", (req, res) => {
  if (!req.query.base) {
    res.send(`
        Base Currency is required.
        Get request cannot be processed without a base currency.
        `);
  }
  if (!req.query.currency) {
    res.send(`
          Rate Currency is required.
          Get request cannot be process without atleast ONE rate currency.
          `);
  }
  const base = req.query.base.toUpperCase();
  const currency = req.query.currency.toUpperCase();
  const url = `https://api.exchangeratesapi.io/latest?base=${base}&symbols=${currency}`;
  fetch(url)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      if (response.status === 400) {
        res.send(
          `<h1>${response.statusText}.Make sure your base and exchange currencies are accurately entered.</h1>`
        );
      }
    })
    .then((data) => {
      if (data) {
        const base = data.base;
        const currentDate = data.date;
        const rates = data.rates;
        return res.json({
          results: {
            base: base,
            date: currentDate,
            rates: rates,
          },
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.get("/", (req, res) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  res.send(`
  <h1>Welcome, Kindly make a get request to "${fullUrl}api/rates" specifying the base and currency parameters.</h1>
  
  <b><i>Note: 'base' parameter is the currency to be quoted against, while 'currency' is a comma seperated list of currencies exchange rate.</i></b><br /><br />

  <b>For Example, "${fullUrl}api/rates?base=CZK&c urrency=EUR,GBP,USD" has a base of "CZK" and currency is a list made up of "EUR, GBP and USD".</b>
  `);
});

app.listen(port, () => {
  console.log("Server running at port " + port);
});
