const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { google } = require('googleapis');
const dotenv = require('dotenv').config();

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const auth = new google.auth.GoogleAuth({
  credentials: {
      type: 'service_account',
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY,
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/" + process.env.CLIENT_EMAIL.replace('@', '%40')
  },
  scopes: 'https://www.googleapis.com/auth/spreadsheets'
});

app.post("/", async function(req, res, next) {
  try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: 'v4', auth: client });
      const rows = sheets.spreadsheets.values.append({
          auth,
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: "A1",
          valueInputOption: "USER_ENTERED",
          resource: {
              majorDimension: "ROWS",
              values: [req.body]
          }
      });
      res.send({message: "Success!"});
  } catch(e) {
      res.send({message: "Failed: " + e.message})
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});

app.listen(9000, () => {
  console.log("Running on port 9000.");
});

module.exports = app;
