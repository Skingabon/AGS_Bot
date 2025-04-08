import 'dotenv/config';
import { google } from 'googleapis';

const SPREADSHEET_ID = '1zegjD4NH8qx4VRbOfNy1hYBEDr1muIObJ6kvibWJnTw';
const SHEET_NAME = 'Отчет';
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.PATH_API_GOOGLE,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

type noteType = {
  id: number;
  entity_id: number;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  responsible_user_id: number;
  group_id: number;
  note_type: string;
  params: {
    thread_id: string;
    message_id: string;
    private: boolean;
    income: boolean;
    from: {
      email: string;
      name: string;
    };
    to: {
      email: string;
      name: string;
    };
    subject: string;
    access_granted: number;
    content_summary: string;
    delivery: {
      status: string;
      time: number;
    };
  };
  account_id: number;
  _links: {
    self: {
      href: string;
    };
  };
};

const token = process.env.FETCH_API_TOKEN;

export const getNotesByLead = (id: number): Promise<noteType[]> => {
  return fetch(`https://agse.amocrm.ru/api/v4/leads/${id}/notes`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((res) => {
      if (res.status === 204) {
        return null; // или пустой массив в зависимости от логики
      }
      return res.json();
    })
    .then((res) => {
      return res._embedded.notes;
    });
};

export const updateLeadDateCall = (id: number, date: string) => {
  return fetch(`https://agse.amocrm.ru/api/v4/leads/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      custom_fields_values: [
        {
          field_id: 607249, // ID поля "Первый исходящий"
          values: [{ value: date }], // Формат: ГГГГ-ММ-ДД ЧЧ:ММ:СС
        },
      ],
    }),
  }).then((res) => res.json());
};

export async function getGoogleSheetData(
  field: string = 'B',
): Promise<Array<string[]>> {
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!${field}2:B150`,
  });
  return response.data.values || [];
}

export async function updateGoogleField(data: string, index: number) {
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!L${index}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[data]] },
  });

  return res;
}
