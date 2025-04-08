import 'dotenv/config';
import { Bot, InlineKeyboard, Keyboard } from 'grammy';
import {
  getGoogleSheetData,
  getNotesByLead,
  updateGoogleField,
  updateLeadDateCall,
} from './api';
import { getDate } from './helper';

const bot = new Bot(process.env.BOT_API_KEY || '');

const menuKeyboard = new Keyboard()
  .text('/generate')
  .row() // Вторая строка
  .resized() // Автоматический размер кнопок
  .persistent(); // Меню не скрывается после нажатия

bot.command('start', async (ctx) => {
  await ctx.reply('Выберите команду:', {
    reply_markup: menuKeyboard,
  });
});

bot.command('generate', async (ctx) => {
  await ctx.reply('Начинаем!');
  const idsLead = await getGoogleSheetData();
  let i = 2;
  for (const el of idsLead.flat()) {
    const idLead = Number(el);
    try {
      const note = await getNotesByLead(idLead);

      if (!note) {
        console.log('note', note);
        throw new Error(`Сделка ${idLead} завершена `);
      }
      const outgoingCalls = note
        .filter((el) => el.note_type === 'call_out')
        .sort((a, b) => a.created_at - b.created_at);

      if (outgoingCalls.length === 0) {
        throw new Error(`Для сделки ${idLead} исходящих звонков не найдено`);
      }

      const firstCall = outgoingCalls[0]; // Берем самый первый звонок
      const date = getDate(firstCall.created_at);
      await Promise.all([
        updateLeadDateCall(idLead, date),
        updateGoogleField(date, i),
      ]);
    } catch (err) {
      if (err instanceof Error) await ctx.reply(`Ошибка: ${err.message}`);
    } finally {
      i++;
    }
  }
  await ctx.reply('Готово!');
});

//
// bot.command('start', async (ctx: Context) => {
//   // await ctx.reply('Привет! Я - бот');
//   const keyboard = new InlineKeyboard()
//     .text('N2', 'button_N2')
//     .row()
//     .text('O2', 'button_O2')
//     .row()
//     .text('Водород', 'button_vod')
//     .row()
//     .text('Осушка', 'button_osu')
//     .row();
//   await ctx.reply('Выберите сферу применения:', {
//     reply_markup: keyboard,
//   });
// });

//
bot.callbackQuery('button_N2', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('Лазерная резка', 'button_laser')
    .row()
    .text('Пищевая', 'button_eda')
    .row()
    .text('Электроника', 'button_electro')
    .row()
    .text('Нефтехимия', 'button_neft')
    .row()
    .text('Лаборатория', 'button_laba')
    .row()
    .text('Другое', 'button_other')
    .row();
  await ctx.reply(
    'Выберите вашу отрасль применения оборудования, мы примерно поймем параметры нужного оборудования:',
    {
      reply_markup: keyboard,
    },
  );
});
bot.callbackQuery('button_laser', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    'Стоимость узлов завист от производительности, вам известны потребляемый объем, чистота газа и давление?',
    {
      reply_markup: keyboard,
    },
  );
});
bot.callbackQuery('button_no', async (ctx) => {
  await ctx.reply('Введите Ваши контакты и менеджер свяжется с Вами');
  const keyboard = new InlineKeyboard()
    .url('Позвонить нам с нашего сайта', 'https://agse.ru')
    .row();

  await ctx.reply('📞', {
    reply_markup: keyboard,
  });
});

bot.callbackQuery('button_yes', async (ctx) => {
  await ctx.reply(
    '1. Введите, какой объем потребления в час (например 10 литров или 3 куба)?',
  );
  await ctx.reply('2. Введите чистоту азота необходимую.');
  await ctx.reply('3. Введите давление в системе.');
});

bot.callbackQuery('button_vod', async (ctx) => {
  await ctx.answerCallbackQuery({ text: 'press vod' });
  // await ctx.editMessageText('press');
});
bot.callbackQuery('button_osu', async (ctx) => {
  await ctx.answerCallbackQuery({ text: 'press osu' });
  // await ctx.editMessageText('press');
});

bot.on('message:text', async (ctx) => {});

bot.start();
