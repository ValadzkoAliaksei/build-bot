import { auth } from './auth';

const { google } = require('googleapis');

export const getApiClient = async () => {
  const client = await auth.getClient();
  const { spreadsheets } = google.sheets({
    version: 'v4',
    auth: client,
  });

  return spreadsheets;
};
