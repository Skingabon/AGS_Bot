import "dotenv/config";



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
};

export type User = unknown; // Измените при необходимости

export const main = {
    subdomain: "ags",
    res_user_id: 123456,
};

const accessToken = process.env.FETCH_API_TOKEN;

export async function sendToAmoCRM(user: User, lead: Lead, contact: Contact): Promise<void> {
    let idLead = await amoFindLead(contact.phone);

    if (idLead) {
        await amoAddNote(lead, idLead);
    } else {
        const contactInfo = await amoFindContact(contact.phone);
        let idContact = contactInfo?.idContact;

        if (idContact) {
            idLead = await amoAddLead(lead, idContact);
            if (idLead && lead.notes) await amoAddNote(lead, idLead);
        } else {
            const newContactId = await amoAddContact(contact);
            if (!newContactId) throw new Error("Не удалось создать контакт");

            idLead = await amoAddLead(lead, newContactId);
            if (!idLead) throw new Error("Не удалось создать сделку");

            if (lead.notes) await amoAddNote(lead, idLead);
        }
    }
}
async function amoFindLead(phone: string): Promise<number | null> {
    const url = `https://${main.subdomain}.amocrm.ru/api/v2/leads?filter%5Bactive%5D=1&query=${phone}`;
    return makeGetRequest(url);
}

async function amoFindContact(phone: string): Promise<any> {
    const url = `https://${main.subdomain}.amocrm.ru/api/v2/contacts/?query=${phone}`;
    return makeGetRequest(url);
}

async function amoAddContact(contact: Contact): Promise<number | null> {
    const url = `https://${main.subdomain}.amocrm.ru/api/v2/contacts`;
    const contactData = {
        add: [{
            name: contact.name,
            responsible_user_id: main.res_user_id,
            custom_fields: [
                { id: contact.phone_f, values: [{ value: contact.phone, enum: "WORK" }] },
                { id: contact.email_f, values: [{ value: contact.email, enum: "WORK" }] },
            ]
        }]
    };
    return makePostRequest(url, contactData);
}

async function amoAddLead(lead: Lead, idContact: number): Promise<number | null> {
    const url = `https://${main.subdomain}.amocrm.ru/api/v2/leads`;
    const leadData = {
        add: [{
            name: lead.name,
            created_at: Math.floor(Date.now() / 1000),
            pipeline_id: lead.pipeline_id,
            status_id: lead.status_id,
            tags: lead.tags,
            contacts_id: [idContact],
            responsible_user_id: main.res_user_id,
        }]
    };
    return makePostRequest(url, leadData);
}

async function amoAddNote(lead: Lead, idLead: number): Promise<void> {
    const url = `https://${main.subdomain}.amocrm.ru/api/v2/notes`;
    const noteData = {
        add: [{
            element_id: idLead,
            element_type: 2,
            note_type: 4,
            text: lead.notes || ""
        }]
    };
    await makePostRequest(url, noteData);
}

async function makeGetRequest(url: string): Promise<any> {
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (!response.ok) throw new Error(`Ошибка запроса: ${response.status}`);
    const data = await response.json();
    return data?._embedded?.items[0] || null;
}

async function makePostRequest(url: string, data: any): Promise<number | null> {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Ошибка запроса: ${response.status}`);
    const responseData = await response.json();
    return responseData?._embedded?.items[0]?.id || null;
}
