import { getApiClient } from './get-api-client';
import { auth } from './auth';

export const setValuesData = async (name, sum) => {
  const range = process.env.RANGE;
  const spreadsheetId = process.env.SPREED_SHEET_ID;
  const spreadsheets = await getApiClient();
  const { data } = await spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: `${range}!A:B`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[name, sum]],
    },
  });
  console.info(data);
};
