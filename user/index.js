const express = require("express");
const app = express();
const envVar = process.env.NODE_ENV;
const logger = require("morgan");
const user = require("./routes/user");
const {handleErrors} = require('./middlewares/handleErrors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggeruser = YAML.load('./docs/swaggeruser.YAML');

app.disable("x-powered-by");
app.use(express.json());
if (envVar !== "production" || envVar !== "test") {
  app.use(logger("dev"));
}

app.use("/api/user", user);
app.use('/user-api-docs', swaggerUi.serve, swaggerUi.setup(swaggeruser));

console.log(process.env.NODE_ENV)
//error middleware must get called last for stable performance
function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}
app.use(logErrors);
app.use(handleErrors);
app.listen(process.env.PORT, () =>
  console.log(`User Service listening on port ${process.env.PORT}!`)
);

module.exports = app;
