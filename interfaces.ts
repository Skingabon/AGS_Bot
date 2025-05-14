export interface Pipeline {
    id: number;
    name: string;
}

interface User {
    // Определите свойства пользователя
}

interface Lead {
    name: string;
    pipeline_id: number;
    status_id: number;
    tags?: string[];
    notes?: string;
    // Добавьте другие необходимые поля
}

interface Contact {
    name: string;
    phone: string;
    email: string;
    phone_f: number;
    email_f: number;
    // Добавьте другие необходимые поля
}