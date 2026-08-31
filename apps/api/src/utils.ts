import { google } from 'googleapis';
import creds from '../sheets-api.json';
import env from './env';
import { VPNProtocol, VpnServer } from '@prisma/client';

export const isJSONErrorResponse = (response: Response) => {
  return (
    response.body && response.headers.get('content-type')?.includes('json')
  );
};

export async function exportToSheet(
  sheetId: string,
  range: string,
  values: (string | number | boolean)[][],
) {
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  return await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: range,
    valueInputOption: 'RAW',
    requestBody: { values },
    auth,
  });
}
export function generateDownloadLink(us: {
  protocol: VPNProtocol;
  server: VpnServer;
  username: string | null;
}) {
  let port = env.IKE_RECEIVER_PORT;
  if (us?.protocol === VPNProtocol.IKEv2) {
    port = env.IKE_RECEIVER_PORT;
  } else if (us?.protocol === VPNProtocol.WireGuard) {
    port = env.WG_RECEIVER_PORT;
  } else {
    port = env.OVPN_RECEIVER_PORT;
  }
  const url = env.APP_ENV === 'local' ? 'http://localhost' : us?.server.url;

  return `${url}:${port}/file?username=${us?.username}`;
}

export function getQRLink(us: {
  protocol: VPNProtocol;
  server: VpnServer;
  username: string | null;
}) {
  if (us?.protocol !== VPNProtocol.WireGuard) {
    return null;
  }
  const port = env.WG_RECEIVER_PORT;
  const url = env.APP_ENV === 'local' ? 'http://localhost' : us?.server.url;
  return `${url}:${port}/qr?username=${us?.username}`;
}
