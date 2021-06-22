const express = require("express");
const app = express();
const envVar = process.env.NODE_ENV;
const cors = require('cors');
const logger = require("morgan");
const paystack = require("./routes/paystack");
const {handleErrors} = require('./middlewares/handleErrors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerwallet = YAML.load('./docs/swaggerwallet.YAML');

app.disable("x-powered-by");
app.use(express.json());
if (envVar !== "production" || envVar !== "test") {
  app.use(logger("dev"));
}

app.use("/api/paystack", paystack);
app.use('/wallet-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerwallet));

console.log(process.env.NODE_ENV)
//error middleware must get called last for stable performance
function logErrors (err, req, res, next) {
  console.error(err)
  next(err)
}
app.use(logErrors);
app.use(handleErrors);
app.listen(process.env.PORT, () =>
  console.log(`wallet Service listening on port ${process.env.PORT}!`)
);

module.exports = app;
