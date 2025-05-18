import 'dotenv/config';
import axios from 'axios';

// Типы данных
export type Contact = {
  name: string;
  phone: string;
  email: string;
  phone_f: number;
  email_f: number;
};

export type Lead = {
  name: string;
  notes?: string;
  pipeline_id: number;
  status_id: number;
  tags?: string[];
  sourceLead: {
    value: string;
    field_id: number;
    enum_id: number;
  };
};

export type User = {
  client_id: string;
  client_secret: string;
  grant_type: string;
  refresh_token?: string;
  code?: string;
  redirect_uri: string;
};

export const main = {
  subdomain: 'agse',
  res_user_id: 123456,
};

// Глобальная переменная для хранения токена
let currentAccessToken: string | undefined = process.env.FETCH_API_TOKEN;

// Основная функция для создания сделки
export async function sendToAmoCRM(lead: Lead): Promise<void> {
  // Создаём сделку
  await amoAddLead(lead);
  console.log('Сделка успешно обработана');
}

async function amoAddLead(lead: Lead) {
  // 1. Создаем сделку
  const leadResponse = await axios.post(
    `https://${main.subdomain}.amocrm.ru/api/v4/leads`,
    [lead],
    {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  console.log(leadResponse);

  const leadId = leadResponse.data._embedded.leads[0].id;

  // 2. Добавляем заметку к сделке
  await axios.post(
    `https://${main.subdomain}.amocrm.ru/api/v4/leads/notes`,
    [
      {
        entity_id: leadId,
        note_type: 'common',
        params: {
          text: lead.notes,
        },
      },
    ],
    {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  await axios.patch(
    `https://${main.subdomain}.amocrm.ru/api/v4/leads/${leadId}`,
    {
      custom_fields_values: [
        {
          field_id: lead.sourceLead.field_id, // ID поля "Источник лида"
          values: [
            {
              value: lead.sourceLead.value,
              enum_id: lead.sourceLead.enum_id,
            },
          ],
        },
      ],
    },
    {
      headers: {
        Authorization: 'Bearer ' + currentAccessToken,
      },
    },
  );
}
