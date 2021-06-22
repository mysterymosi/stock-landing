const express = require(`express`);
const app = express();
const envVar = process.env.NODE_ENV;
const logger = require(`morgan`);
const cors = require('cors');
const kyc = require(`./routes/kyc`);
const { handleErrors } = require(`./middlewares/handleErrors`);

app.use(cors());
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (envVar !== `production` || envVar !== `test`) {
    app.use(logger(`dev`));
}

app.use(`/api/kyc`, kyc);

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

app.use(logErrors);
app.use(handleErrors);

if (process.env.NODE_ENV != `test`) {
    app.listen(process.env.PORT, () => console.log(`Kyc Service is listening on ${process.env.PORT}`));
}

module.exports = app;