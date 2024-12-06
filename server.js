const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const multer = require('multer'); // Nueva biblioteca para manejar form-data
const app = express();
const port = 3000;

// Configuración del logger con winston
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

// Middleware para procesar JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de multer para manejar form-data
const upload = multer();

// Middleware de Morgan para logs
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
        formData: req.body || req.files, // Incluye form-data procesado por multer
        ip: req.ip,
        status: tokens.status(req, res),
        responseTime: `${tokens['response-time'](req, res)} ms`,
      },
    };
    logger.info(logDetails);
    return null;
  })
);

// Ruta de ejemplo para manejar JSON, URL-encoded y form-data
app.post('/', upload.any(), (req, res) => {
  res.send({
    message: 'Datos recibidos',
    body: req.body,
    files: req.files,
  });
});

app.listen(port, () => {
  logger.info({ message: `Server running at http://localhost:${port}` });
});
