import { Bot, Context, session, SessionFlavor, InlineKeyboard } from 'grammy';
import 'dotenv/config';
import { sendToAmoCRM as sendToAmoFromApi } from './api'; // используем переименование
import type { Lead } from './api';
import { sendService } from './emailSender';

// const userEmail = process.env.RECEIVER_EMAIL; // куда отправляем письмо

// Типы для сессии
export interface SessionData {
  selectedGas?: 'N2' | 'O2' | 'Водород' | 'Осушка'| 'Заявка в сервисную службу АГС';
  industry?: string;
  knowsParams?: boolean;
  performance?: string;
  dewPoint?: string;
  pressure?: string;
  purity?: string;
  contacts?: string;
  information?: string;
}

type MyContext = Context & SessionFlavor<SessionData>;

// Константы для текста
const otrasl = 'Выберите отрасль применения:';
const stoimostN2 =
  'Введете нужные параметры азотной станции (производительность, точку росы и т.д.)?';
const stoimostO2 =
  'Я покажу вам нужные параметры кислородной станции, сможете их ввести?';
const stoimostVod =
  'Я покажу вам нужные параметры водородной станции, сможете их ввести?';
const stoimostOsu =
  'Я покажу вам нужные параметры осушителя, сможете их ввести?';
  const serviceAGS =
  'Ответьте пожалуйста на несколько вопросов';

// Инициализация бота
const bot = new Bot<MyContext>(process.env.BOT_API_KEY || '');


bot.api.setMyCommands([{ command: 'start', description: 'Запустить бота' }]);

// Настройка сессии
bot.use(session({ initial: (): SessionData => ({}) }));

// ==================== Команда /start ====================
bot.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('N2', 'button_N2')
    .text('O2', 'button_O2')
    .row()
    .text('Водород', 'button_vod')
    .text('Осушка', 'button_osu')
    .row()
    .text('Заявка в сервисную службу АГС', 'button_service');
  // .text('TEST', 'test'); //TODO: удалить

  await ctx.reply('Здравствуйте! Выберите тип оборудования или оставьте заявку в сервисную службу АГС:', {
    reply_markup: keyboard,
  });
});

// ==================== Обработчики кнопок ====================

// ------ Блок сервиса ------
bot.callbackQuery('button_service', async (ctx) => {
  ctx.session.selectedGas = 'Заявка в сервисную службу АГС';
  const keyboard = new InlineKeyboard()
    .text('Ответить', 'button_otvet')
    .row();
  await ctx.reply(serviceAGS, { reply_markup: keyboard });
});

bot.callbackQuery('button_otvet', async (ctx) => {
  ctx.session.knowsParams = true;
  await ctx.reply('Укажите ИНН организации, тип оборудования, тип неисправности и Ваши контактные данные (телефон, email):');
});


// ------ Блок N2 ------
bot.callbackQuery('button_N2', async (ctx) => {
  ctx.session.selectedGas = 'N2';
  const keyboard = new InlineKeyboard()
    .text('Лазерная резка', 'button_laser')
    .row()
    .text('Пищевая', 'button_eda')
    .row()
    .text('Электроника', 'button_electro')
    .row()
    .text('Другая отрасль', 'button_other');

  await ctx.reply(otrasl, { reply_markup: keyboard });
});

// ------ Блок O2 ------
bot.callbackQuery('button_O2', async (ctx) => {
  ctx.session.selectedGas = 'O2';
  const keyboard = new InlineKeyboard()
    .text('Рыборазведение', 'button_fish')
    .row()
    .text('Металлургия', 'button_metal')
    .row()
    .text('Другая отрасль', 'button_other');

  await ctx.reply(otrasl, { reply_markup: keyboard });
});

// ------ Блок Водород ------
bot.callbackQuery('button_vod', async (ctx) => {
  ctx.session.selectedGas = 'Водород';
  const keyboard = new InlineKeyboard()
    .text('Энергетика', 'button_energetika')
    .row()
    .text('Электроника', 'button_electro')
        .row()
    .text('Другая отрасль', 'button_other');

  await ctx.reply(otrasl, { reply_markup: keyboard });
});

// ------ Блок Осушка ------
bot.callbackQuery('button_osu', async (ctx) => {
  ctx.session.selectedGas = 'Осушка';
  const keyboard = new InlineKeyboard()
    .text('Адсорбционный (холодная регенерация)', 'button_ahr')
    .row()
    .text('Адсорбционный (горячая регенерация)', 'button_agr');

  await ctx.reply('Выберите тип осушителя:', { reply_markup: keyboard });
});

// ------ Для N2 ------
bot.callbackQuery('button_laser', async (ctx) => {
  ctx.session.industry = 'Лазерная резка';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .text('НЕТ', 'button_no');
  await ctx.reply(stoimostN2, { reply_markup: keyboard });
});

bot.callbackQuery('button_eda', async (ctx) => {
  ctx.session.industry = 'Пищевая';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .text('НЕТ', 'button_no');
  await ctx.reply(stoimostN2, { reply_markup: keyboard });
});

bot.callbackQuery('button_electro', async (ctx) => {
  ctx.session.industry = 'Электроника';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .text('НЕТ', 'button_no');
  await ctx.reply(stoimostN2, { reply_markup: keyboard });
});

bot.callbackQuery('button_other', async (ctx) => {
  ctx.session.industry = 'Другая отрасль';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .text('НЕТ', 'button_no');
  await ctx.reply(stoimostN2, { reply_markup: keyboard });
});

// ------ Для O2 ------
bot.callbackQuery('button_fish', async (ctx) => {
  ctx.session.industry = 'Рыборазведение';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .text('НЕТ', 'button_no');
  await ctx.reply(stoimostO2, { reply_markup: keyboard });
});

bot.callbackQuery('button_metal', async (ctx) => {
  ctx.session.industry = 'Металлургия';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .text('НЕТ', 'button_no');
  await ctx.reply(stoimostO2, { reply_markup: keyboard });
});

bot.callbackQuery('button_other', async (ctx) => {
  ctx.session.industry = 'Другая отрасль';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .text('НЕТ', 'button_no');
  await ctx.reply(stoimostO2, { reply_markup: keyboard });
});

// ------ Для Водорода ------
bot.callbackQuery('button_energetika', async (ctx) => {
  ctx.session.industry = 'Энергетика';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .text('НЕТ', 'button_no');
  await ctx.reply(stoimostVod, { reply_markup: keyboard });
});

bot.callbackQuery('button_electro', async (ctx) => {
  ctx.session.industry = 'Электроника';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .text('НЕТ', 'button_no');
  await ctx.reply(stoimostVod, { reply_markup: keyboard });
});

bot.callbackQuery('button_other', async (ctx) => {
  ctx.session.industry = 'Другая отрасль';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .text('НЕТ', 'button_no');
  await ctx.reply(stoimostVod, { reply_markup: keyboard });
});

// ------ Для Осушителя ------
bot.callbackQuery('button_ahr', async (ctx) => {
  ctx.session.industry = 'Адсорбционный (холодная регенерация)';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yesOsush')
    .text('НЕТ', 'button_noOsush');
  await ctx.reply(stoimostOsu, { reply_markup: keyboard });
});

bot.callbackQuery('button_agr', async (ctx) => {
  ctx.session.industry = 'Адсорбционный (горячая регенерация)';
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yesOsush')
    .text('НЕТ', 'button_noOsush');
  await ctx.reply(stoimostOsu, { reply_markup: keyboard });
});

// ==================== Обработка ответов "ДА/НЕТ" ====================
bot.callbackQuery(['button_yes', 'button_yesOsush'], async (ctx) => {
  ctx.session.knowsParams = true;
  await ctx.reply('1. Введите производительность (нм³/час):');
});

bot.callbackQuery(['button_no', 'button_noOsush'], async (ctx) => {
  ctx.session.knowsParams = false;
  await ctx.reply('Введите ваши контакты (email, телефон):');
});

// ==================== Сбор данных ====================
bot.on('message:text', async (ctx) => {
  // ======= Сервисная заявка =======
  if (ctx.session.selectedGas === 'Заявка в сервисную службу АГС' && !ctx.session.contacts) {
    ctx.session.contacts = ctx.message.text;
    await ctx.reply(
      '✅ Ваша заявка в сервисную службу принята. Спасибо. С вами свяжутся в ближайшее время.',
    );

    // Отправка в amoCRM
    await sendToAmoCRM(ctx.session);
await sendService(ctx.session);
    // Очистка
    ctx.session = {};
    return;
  }
// bot.on('message:text', async (ctx) => {
  if (!ctx.session.performance && ctx.session.knowsParams) {
    ctx.session.performance = ctx.message.text;
    await ctx.reply('2. Введите точку росы (-40 или -70):');
  } else if (!ctx.session.dewPoint && ctx.session.performance) {
    ctx.session.dewPoint = ctx.message.text;
    await ctx.reply('3. Введите давление (MPa):');
  } else if (!ctx.session.pressure && ctx.session.dewPoint) {
    ctx.session.pressure = ctx.message.text;
    await ctx.reply('4. Введите чистоту газа (%):');
  } else if (!ctx.session.purity && ctx.session.pressure) {
    ctx.session.purity = ctx.message.text;
    await ctx.reply('5. Введите ваши контакты (телефон, email):');
  } else if (!ctx.session.contacts) {
    ctx.session.contacts = ctx.message.text;
    await ctx.reply(
      'Напишите, пожалуйста, как к Вам обращаться и опишите вашу задачу или информацию, которую считаете нужной для нас.',
    );
  } else if (!ctx.session.information) {
    ctx.session.information = ctx.message.text;

    await ctx.reply(
      '✅ Данные направлены инженеру для расчета. Спасибо. С вами свяжутся в ближайшее время.',
    );
    // Параллельно отправляем данные в amoCRM

    await sendToAmoCRM(ctx.session); // перед очисткой, чтобы данные не потерялись
    
  // Отправка на email
await sendService(ctx.session);
    // Очищаем сессию
    ctx.session = {};
  }
});

// ==================== Отправка в amoCRM ====================
async function sendToAmoCRM(data: SessionData) {
  if (!data.contacts) {
    console.error('Нет контактной информации');
    return;
  }

  // Простейший парсинг телефона и email
  const phoneMatch = data.contacts.match(/(\+?\d[\d\-\s]{7,})/);
  const emailMatch = data.contacts.match(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
  );

  const noteParts = [
    `Тип оборудования: ${data.selectedGas || 'не указан'}`,
    `Отрасль: ${data.industry || 'не указана'}`,
    `Производительность: ${data.performance || 'не указана'}`,
    `Точка росы: ${data.dewPoint || 'не указана'}`,
    `Давление: ${data.pressure || 'не указано'}`,
    `Чистота: ${data.purity || 'не указана'}`,
    `Контакты: ${phoneMatch?.[0]}  ${emailMatch?.[0]}`,
    `Информация: ${data.information || 'не указана'}`,
  ];

  //TODO заполнять источник лида "Telegram"
  const lead: Lead = {
    // name: `Заявка на ${data.selectedGas || 'оборудование'}`,
    name:
    data.selectedGas === 'Заявка в сервисную службу АГС'
      ? 'Сервисная заявка'
      : `Заявка на ${data.selectedGas || 'оборудование'}`,
    pipeline_id: 5716552, // замените на ID нужной воронки
    status_id: 50238949, // замените на ID нужного статуса
    tags: [data.selectedGas || 'Без тега'],
    // notes: noteParts.join('\n'),
    notes:
    data.selectedGas === 'Заявка в сервисную службу АГС'
      ? `Сервисная заявка:\nКонтакты: ${data.contacts}`
      : noteParts.join('\n'),
    sourceLead: {
      value: 'Telegram',
      field_id: 595185,
      enum_id: 836051,
    },
  };

  try {
    await sendToAmoFromApi(lead); // передаём пустой user, если он не используется
    console.log('Заявка успешно отправлена в amoCRM');
  } catch (error) {
    if (error instanceof Error)
      console.error('Ошибка при отправке в amoCRM:', error.message);
  }
}

// Запуск бота
bot.start();
