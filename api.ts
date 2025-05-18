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
  custom_fields_values: { field_id: number; field_type?: string; values: { value: string, enum_id?: number }[] }[];
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

// Авторизация в AmoCRM
export async function amoAuthorize(
  user: User,
  subdomain: string,
): Promise<string> {
  const url = `https://${subdomain}.amocrm.ru/oauth2/access_token`;
  console.log(user);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  if (!response.ok) throw new Error(`Ошибка авторизации: ${response.status}`);
  const data = await response.json();
  console.log(data);

  // Сохраняем токен
  currentAccessToken = data.access_token;
  return data.access_token;
}

// Получение текущего токена (с авторизацией при необходимости)
async function getAccessToken(): Promise<string> {
  if (currentAccessToken) return currentAccessToken;

  const user: User = {
    client_id: process.env.AMO_CLIENT_ID!,
    client_secret: process.env.AMO_CLIENT_SECRET!,
    grant_type: 'authorization_code',
    code: process.env.AMO_AUTH_CODE!, // Получается при первом OAuth flow
    redirect_uri: process.env.AMO_REDIRECT_URI!,
  };

  return await amoAuthorize(user, main.subdomain);
}

// Основная функция для создания сделки
export async function sendToAmoCRM(
  lead: Lead,
  contact: Contact,
): Promise<void> {
  // try {
  // Получаем токен
  const accessToken = await getAccessToken();

  // Ищем сделку
  // let idLead = await amoFindLead(accessToken, contact.phone);
  let idLead = null;
  if (idLead) {
    await amoAddNote(accessToken, lead, idLead);
  } else {
    // Ищем контакт
    // const contactInfo = await amoFindContact(accessToken, contact.phone);
    // let idContact = contactInfo?.idContact;
    //
    // if (!idContact) {
    //   // Создаём новый контакт
    //   idContact = await amoAddContact(accessToken, contact);
    //   if (!idContact) throw new Error('Не удалось создать контакт');
    // }

    // Создаём сделку
    await amoAddLead(lead);
    // if (!idLead) throw new Error('Не удалось создать сделку');
    //
    // // Добавляем заметку
    // if (lead.notes) await amoAddNote(accessToken, lead, idLead);
  }

  console.log('Сделка успешно обработана:', { idLead });
  // } catch (err) {
  //   if (err instanceof Error) {
  //     console.error(`sendToAmoCRM: ${err.message}`);
  //     throw err; // Пробрасываем ошибку для обработки в вызывающем коде
  //   }
  // }
}

// API методы с поддержкой OAuth
async function amoFindLead(
  accessToken: string,
  phone: string,
): Promise<number | null> {
  const url = `https://${main.subdomain}.amocrm.ru/api/v2/leads?filter%5Bactive%5D=1&query=${phone}`;
  return await makeGetRequest(url, accessToken);
}

async function amoFindContact(
  accessToken: string,
  phone: string,
): Promise<any> {
  const url = `https://${main.subdomain}.amocrm.ru/api/v2/contacts/?query=${phone}`;
  return await makeGetRequest(url, accessToken);
}

// async function amoAddContact(
//   accessToken: string,
//   contact: Contact,
// ): Promise<number | null> {
//   const url = `https://${main.subdomain}.amocrm.ru/api/v4/contacts`;
//
//   const contactData = [
//     {
//       name: contact.name,
//       responsible_user_id: contact.responsible_user_id,
//       custom_fields_values: [
//         ...(contact.phone
//           ? [
//               {
//                 field_code: 'PHONE', // или field_id если используете ID поля
//                 values: [
//                   {
//                     value: contact.phone,
//                     enum_code: 'WORK', // тип телефона
//                   },
//                 ],
//               },
//             ]
//           : []),
//         ...(contact.email
//           ? [
//               {
//                 field_code: 'EMAIL', // или field_id
//                 values: [
//                   {
//                     value: contact.email,
//                     enum_code: 'WORK', // тип email
//                   },
//                 ],
//               },
//             ]
//           : []),
//       ],
//     },
//   ];
//
//   const response = await axios.post(url, contactData, {
//     headers: {
//       Authorization: `Bearer ${currentAccessToken}`,
//       'Content-Type': 'application/json',
//     },
//   });
//
//   // return makePostRequest(url, contactData, accessToken);
// }

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
}

// async function amoAddLead(accessToken: string, lead: Lead, contact: string) {
//   // 1. Создаем сделку
//   const leadResponse = await axios.post(
//     `https://${main.subdomain}.amocrm.ru/api/v4/leads`,
//     [lead],
//     {
//       headers: {
//         Authorization: `Bearer ${currentAccessToken}`,
//         'Content-Type': 'application/json',
//       },
//     },
//   );
//
//   const leadId = leadResponse.data._embedded.leads[0].id;
//
//   // 2. Добавляем заметку к сделке
//   await axios.post(
//     `https://${main.subdomain}.amocrm.ru/api/v4/leads/notes`,
//     [
//       {
//         entity_id: leadId,
//         note_type: 'common',
//         params: {
//           text: lead.notes,
//         },
//       },
//     ],
//     {
//       headers: {
//         Authorization: `Bearer ${currentAccessToken}`,
//         'Content-Type': 'application/json',
//       },
//     },
//   );
//   // const url = `https://${main.subdomain}.amocrm.ru/api/v4/leads`;
//   // const leadData = {
//   //   add: [
//   //     {
//   //       name: lead.name,
//   //       created_at: Math.floor(Date.now() / 1000),
//   //       pipeline_id: lead.pipeline_id,
//   //       status_id: lead.status_id,
//   //       tags: lead.tags,
//   //       contacts_id: [contact],
//   //       responsible_user_id: main.res_user_id,
//   //     },
//   //   ],
//   // };
//   // return makePostRequest(url, leadData, accessToken);
// }

async function amoAddNote(
  accessToken: string,
  lead: Lead,
  idLead: number,
): Promise<void> {
  const url = `https://${main.subdomain}.amocrm.ru/api/v2/notes`;
  const noteData = {
    add: [
      {
        element_id: idLead,
        element_type: 2,
        note_type: 4,
        text: lead.notes || '',
      },
    ],
  };
  await makePostRequest(url, noteData, accessToken);
}

// Базовые методы запросов с OAuth
async function makeGetRequest(url: string, accessToken: string): Promise<any> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Ошибка GET запроса: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`,
    );
  }

  const data = await response.json();
  return data?._embedded?.items[0] || null;
}

async function makePostRequest(
  url: string,
  data: any,
  accessToken: string,
): Promise<number | null> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Ошибка POST запроса: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`,
    );
  }

  const responseData = await response.json();
  return responseData?._embedded?.items[0]?.id || null;
}
