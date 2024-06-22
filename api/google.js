var express = require("express");
var router = express.Router();
var { google } = require('googleapis');
const dotenv = require('dotenv').config();

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
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/" + process.env.CLIENT_EMAIL.replace('@', '%40'),
        universe_domain: "googleapis.com"
    },
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
});

router.post("/", async function(req, res, next) {
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

module.exports = router;