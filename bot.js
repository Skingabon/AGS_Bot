require('dotenv').config();
const { Bot, InlineKeyboard } = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);

bot.command('start', async (ctx) => {
  // await ctx.reply('Привет! Я - бот');
  const keyboard = new InlineKeyboard()
    .text('N2', 'button_N2')
    .row()
    .text('O2', 'button_O2')
    .row()
    .text('Водород', 'button_vod')
    .row()
    .text('Осушка', 'button_osu')
    .row();
  await ctx.reply('Выберите сферу применения:', {
    reply_markup: keyboard,
  });
});

// bot.on('message', (ctx) => ctx.reply('hello'));
bot.callbackQuery('button_N2', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('Лазерная резка', 'button_laser')
    .row()
    .text('Пищевая', 'button_eda')
    .row()
    .text('Электроника', 'button_electro')
    .row();

  await ctx.reply('Выберите вашу отрасль применения:', {
    reply_markup: keyboard,
  });
});
bot.callbackQuery('button_laser', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply('Стоимость завист от производительности, вам они известны?', {
    reply_markup: keyboard,
  });
});
bot.callbackQuery('button_no', async (ctx) => {
  await ctx.reply('Введите Ваши контакты и менеджер свяжется с Вами');
  const keyboard = new InlineKeyboard()
    .url('Позвонить нам с нашего сайта', 'https://asge.ru')
    .row();

  await ctx.reply('📞', {
    reply_markup: keyboard,
  });
});
bot.on('message', async (ctx) => {
  console.log(ctx.message);
});

bot.callbackQuery('button_O2', async (ctx) => {
  await ctx.answerCallbackQuery({ text: 'press O2' });
  // await ctx.editMessageText('press');
});
bot.callbackQuery('button_vod', async (ctx) => {
  await ctx.answerCallbackQuery({ text: 'press vod' });
  // await ctx.editMessageText('press');
});
bot.callbackQuery('button_osu', async (ctx) => {
  await ctx.answerCallbackQuery({ text: 'press osu' });
  // await ctx.editMessageText('press');
});
bot.start();
