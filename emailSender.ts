import 'dotenv/config';
import nodemailer from 'nodemailer';
import type { SessionData } from './bot'

export async function sendService(data: SessionData) {  

    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: '911@agse.ru',
    subject: 'Заявка в сервисную службу из телеграмм бота',
    html: `
  <h2>Сервисная заявка из Telegram-бота</h2>
  <p><b>Контакты:</b> ${data.contacts}</p>
`.trim(),
  });
}
