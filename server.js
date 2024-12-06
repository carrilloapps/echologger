const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const multer = require('multer');
const app = express();
const port = 3000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.printf(({ message }) => {
    if (typeof message === 'object') {
      return `Request ${JSON.stringify(message, null, 2)}`;
    }
    return message;
  }),
  transports: [new winston.transports.Console()],
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer();

app.use(
  morgan((tokens, req, res) => {
    const logDetails = {
      request: {
        timestamp: tokens.date(req, res, 'iso'),
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: req.body,
        formData: req.body || req.files,
        ip: req.ip,
        status: tokens.status(req, res),
        responseTime: `${tokens['response-time'](req, res)} ms`,
      },
    };
    logger.info(logDetails);
    return null;
  })
);

app.all('/', upload.any(), (req, res) => {
  res.send({
    message: 'SUCCESSFULLY RECEIVED DATA',
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  logger.info({ message: `Server running at http://localhost:${port}` });
});
