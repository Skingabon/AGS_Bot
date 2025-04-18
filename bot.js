require('dotenv').config();
const { Bot, InlineKeyboard } = require('grammy');
const otrasl = 'Выберите отрасль применения, мы поймем примерные параметры нужного оборудования:'
const stoimostN2 = 'Стоимость азотной станции завист от производительности, вам известны производительность м3/час, точка росы, давление в барах, чистота газа?'
const stoimostO2 = 'Стоимость кислородной станции завист от производительности, вам известны производительность м3/час, точка росы, давление в барах, чистота газа?'
const stoimostVod = 'Стоимость водородной станции завист от производительности, вам известны производительность м3/час, точка росы, давление в барах, чистота газа?'
const stoimostOsu = 'Стоимость осушителя завист от производительности, вам известны производительность м3/час, точка росы, давление в барах, чистота газа?'
// API-ключ OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// API-ключ Telegram-бота
const bot = new Bot(process.env.BOT_API_KEY);


function DaNet() {
  bot.callbackQuery('button_no', async (ctx) => {
    await ctx.reply('Введите Ваши контакты и менеджер свяжется с Вами или позвониите нам:');
    const keyboard = new InlineKeyboard()
      .url('Позвонить нам с нашего сайта', 'https://agse.ru')
      .row();

    await ctx.reply('📞', {
      reply_markup: keyboard,
    });
  });
  bot.on('message', async (ctx) => {
    console.log(ctx.message);
  });

  bot.callbackQuery('button_yes', async (ctx) => {
      await ctx.reply('1. Введите производительность нм3/час?');
      await ctx.reply('2. Введите нужную точку росы (-40 или -70).');
      await ctx.reply('3. Введите давление в системе в MPa.');
      await ctx.reply('4. Введите нужную чистоту газа.');
  });
}

function DaNetOsush() {
  bot.callbackQuery('button_noOsush', async (ctx) => {
    await ctx.reply('Введите Ваши контакты и менеджер свяжется с Вами или позвониите нам:');
    const keyboard = new InlineKeyboard()
      .url('Позвонить нам с нашего сайта', 'https://agse.ru')
      .row();

    await ctx.reply('📞', {
      reply_markup: keyboard,
    });
  });
  bot.on('message', async (ctx) => {
    console.log(ctx.message);
  });

  bot.callbackQuery('button_yesOsush', async (ctx) => {
      await ctx.reply('1. Введите производительность нм3/час?');
      await ctx.reply('2. Введите нужную точку росы (-40 или -70).');
      await ctx.reply('3. Введите давление в системе в MPa.');
  });
}


//
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
  await ctx.reply('Здравствуйте. Выберите сферу применения:', {
    reply_markup: keyboard,
  });
});

//БЛОК АЗОТ
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
    otrasl,
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
    stoimost,
    {
      reply_markup: keyboard,
    },
  );
});
DaNet();

bot.callbackQuery('button_eda', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    stoimostN2,
    {
      reply_markup: keyboard,
    },
  );
});
DaNet();

bot.callbackQuery('button_electro', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    stoimostN2,
    {
      reply_markup: keyboard,
    },
  );
});
DaNet();

bot.callbackQuery('button_neft', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    stoimostN2,
        {
      reply_markup: keyboard,
    },
  );
});
DaNet();

bot.callbackQuery('button_laba', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    stoimostN2,
        {
      reply_markup: keyboard,
    },
  );
});
DaNet();

bot.callbackQuery('button_other', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    stoimostN2,
        {
      reply_markup: keyboard,
    },
  );
});
DaNet();


//БЛОК КИСЛОРОД
bot.callbackQuery('button_O2', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('Рыборазведение', 'button_fish')
    .row()
    .text('Металлургия', 'button_metal')
    .row()
    .text('Другое', 'button_other')
    .row()
  await ctx.reply(
    otrasl,
    {
      reply_markup: keyboard,
    },
  );
});
bot.callbackQuery('button_fish', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    stoimostO2,
        {
      reply_markup: keyboard,
    },
  );
});
DaNet();
bot.callbackQuery('button_metal', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    stoimostO2,
        {
      reply_markup: keyboard,
    },
  );
});
DaNet();
bot.callbackQuery('button_other', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    stoimostO2,
        {
      reply_markup: keyboard,
    },
  );
});
DaNet();


//БЛОК ВОДОРОД
bot.callbackQuery('button_vod', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('Энергетика', 'button_energetika')
    .row()
    .text('Электроника', 'button_electro')
    .row()
    .text('Металлургия', 'button_metal')
    .row()
    .text('Нефтехимия', 'button_neftehim')
    .row()
    .text('Поставка электролизных ячеек ERRE DUE', 'button_zapchast')
    .row();
  await ctx.reply(
    otrasl,
    {
      reply_markup: keyboard,
    },
  );
});
bot.callbackQuery('button_energetika', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    stoimostVod,
        {
      reply_markup: keyboard,
    },
  );
});
DaNet();
bot.callbackQuery('button_electro', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    stoimostVod,
        {
      reply_markup: keyboard,
    },
  );
});
DaNet();
bot.callbackQuery('button_metal', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    'Стоимость станции завист от производительности, вам известны потребляемый объем, чистота газа и давление?',
    {
      reply_markup: keyboard,
    },
  );
});
DaNet();
bot.callbackQuery('button_neftehim', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yes')
    .row()
    .text('НЕТ', 'button_no')
    .row();

  await ctx.reply(
    stoimostVod,
        {
      reply_markup: keyboard,
    },
  );
});
DaNet();
bot.callbackQuery('button_zapchast', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('G13', 'button_G13')
    .row()
    .text('G16', 'button_G16')
    .row()
    .text('G24', 'button_G24')
    .row()
    .text('G32', 'button_G32')
    .row()
    .text('Связаться с нами', 'button_callMe')
    .row();
  await ctx.reply(
    'Выберите модель электролизера:',
    {
      reply_markup: keyboard,
    },
  );
});
bot.callbackQuery('button_G13', async (ctx) => {
  await ctx.reply('Пришлите фото шильдика электролизера (год выпуска, серийный номер, давление).');
});
bot.callbackQuery('button_G16', async (ctx) => {
  await ctx.reply('Пришлите фото шильдика электролизера (год выпуска, серийный номер, давление).');
});
bot.callbackQuery('button_G24', async (ctx) => {
  await ctx.reply('Пришлите фото шильдика электролизера (год выпуска, серийный номер, давление).');
});
bot.callbackQuery('button_G32', async (ctx) => {
  await ctx.reply('Пришлите фото шильдика электролизера (год выпуска, серийный номер, давление).');
});
bot.callbackQuery('button_callMe', async (ctx) => {
  await ctx.reply('Введите Ваши контакты и менеджер свяжется с Вами или позвоните нам:');
  const keyboard = new InlineKeyboard()
    .url('Позвонить нам с нашего сайта', 'https://agse.ru')
    .row();

  await ctx.reply('📞', {
    reply_markup: keyboard,
  });
});
bot.on('message', async (ctx) => {
  console.log(ctx.message);
});
DaNet()

//БЛОК ОСУШИТЕЛЬ
bot.callbackQuery('button_osu', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('Адсорбционный с холодной регенерацией', 'button_ahr')
    .row()
    .text('Адсорбционный с горячей регенарицией', 'button_agr')
    .row()
  await ctx.reply(
    'Выберите нужный тип осушителя:',
    {
      reply_markup: keyboard,
    },
  )
});
bot.callbackQuery('button_ahr', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yesOsush')
    .row()
    .text('НЕТ', 'button_noOsush')
    .row()

  await ctx.reply(
    stoimostOsu,
        {
      reply_markup: keyboard,
    },
  );
});
DaNetOsush();
bot.callbackQuery('button_agr', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('ДА', 'button_yesOsush')
    .row()
    .text('НЕТ', 'button_noOsush')
    .row()

  await ctx.reply(
    stoimostOsu,
        {
      reply_markup: keyboard,
    },
  );
});
DaNetOsush();

bot.start();
