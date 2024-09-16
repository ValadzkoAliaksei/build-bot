import { getApiClient } from './get-api-client';

export const getValuesData = async () => {
  const spreadsheets = await getApiClient();
  const range = process.env.RANGE;
  const spreadsheetId = process.env.SPREED_SHEET_ID;
  const { data } = await spreadsheets.get({
    spreadsheetId,
    ranges: range,
    fields: 'sheets',
    includeGridData: true,
  });

  return data.sheets;
};
