const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

export default async function getRecipeData(req, res) {
  const {query: { id }} = req;
  console.log(id);
  try {
    if (!id) throw new Error();

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n')
    });

    const data = doc.getInfo();

    res.status(200).json({ message: 'Success!' });
    
    return data;
  } catch (error) {
    res.status(500).json(error);
  }
}
