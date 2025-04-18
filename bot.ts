import { Bot, Context, session, SessionFlavor, InlineKeyboard } from "grammy";
import axios from "axios";
import "dotenv/config";

// Типы для сессии
interface SessionData {
    selectedGas?: "N2" | "O2" | "Водород" | "Осушка";
    industry?: string;
    knowsParams?: boolean;
    performance?: string;
    dewPoint?: string;
    pressure?: string;
    purity?: string;
    contacts?: string;
}

type MyContext = Context & SessionFlavor<SessionData>;

// Константы для текста
const otrasl = "Выберите отрасль применения:";
const stoimostN2 = "Укажите параметры азотной станции (производительность, точку росы и т.д.):";
const stoimostO2 = "Укажите параметры кислородной станции:";
const stoimostVod = "Укажите параметры водородной станции:";
const stoimostOsu = "Укажите параметры осушителя:";

// Инициализация бота
const bot = new Bot<MyContext>(process.env.BOT_API_KEY || "");

bot.api.setMyCommands([
    { command: "start", description: "Запустить бота" },
]);

// Настройка сессии
bot.use(session({ initial: (): SessionData => ({}) }));

// ==================== Команда /start ====================
bot.command("start", async (ctx) => {
    const keyboard = new InlineKeyboard()
        .text("N2", "button_N2")
        .text("O2", "button_O2")
        .row()
        .text("Водород", "button_vod")
        .text("Осушка", "button_osu");

    await ctx.reply("Здравствуйте! Выберите тип оборудования:", {
        reply_markup: keyboard,
    });
});

// ==================== Обработчики кнопок ====================

// ------ Блок N2 ------
bot.callbackQuery("button_N2", async (ctx) => {
    ctx.session.selectedGas = "N2";
    const keyboard = new InlineKeyboard()
        .text("Лазерная резка", "button_laser")
        .row()
        .text("Пищевая", "button_eda")
        .row()
        .text("Электроника", "button_electro");

    await ctx.reply(otrasl, { reply_markup: keyboard });
});

// ------ Блок O2 ------
bot.callbackQuery("button_O2", async (ctx) => {
    ctx.session.selectedGas = "O2";
    const keyboard = new InlineKeyboard()
        .text("Рыборазведение", "button_fish")
        .row()
        .text("Металлургия", "button_metal");

    await ctx.reply(otrasl, { reply_markup: keyboard });
});

// ------ Блок Водород ------
bot.callbackQuery("button_vod", async (ctx) => {
    ctx.session.selectedGas = "Водород";
    const keyboard = new InlineKeyboard()
        .text("Энергетика", "button_energetika")
        .row()
        .text("Электроника", "button_electro");

    await ctx.reply(otrasl, { reply_markup: keyboard });
});

// ------ Блок Осушка ------
bot.callbackQuery("button_osu", async (ctx) => {
    ctx.session.selectedGas = "Осушка";
    const keyboard = new InlineKeyboard()
        .text("Адсорбционный (холодная регенерация)", "button_ahr")
        .row()
        .text("Адсорбционный (горячая регенерация)", "button_agr");

    await ctx.reply("Выберите тип осушителя:", { reply_markup: keyboard });
});

// ------ Для N2 ------
bot.callbackQuery("button_laser", async (ctx) => {
    ctx.session.industry = "Лазерная резка";
    const keyboard = new InlineKeyboard()
        .text("ДА", "button_yes")
        .text("НЕТ", "button_no");
    await ctx.reply(stoimostN2, { reply_markup: keyboard });
});

bot.callbackQuery("button_eda", async (ctx) => {
    ctx.session.industry = "Пищевая";
    const keyboard = new InlineKeyboard()
        .text("ДА", "button_yes")
        .text("НЕТ", "button_no");
    await ctx.reply(stoimostN2, { reply_markup: keyboard });
});

bot.callbackQuery("button_electro", async (ctx) => {
    ctx.session.industry = "Электроника";
    const keyboard = new InlineKeyboard()
        .text("ДА", "button_yes")
        .text("НЕТ", "button_no");
    await ctx.reply(stoimostN2, { reply_markup: keyboard });
});

// ------ Для O2 ------
bot.callbackQuery("button_fish", async (ctx) => {
    ctx.session.industry = "Рыборазведение";
    const keyboard = new InlineKeyboard()
        .text("ДА", "button_yes")
        .text("НЕТ", "button_no");
    await ctx.reply(stoimostO2, { reply_markup: keyboard });
});

bot.callbackQuery("button_metal", async (ctx) => {
    ctx.session.industry = "Металлургия";
    const keyboard = new InlineKeyboard()
        .text("ДА", "button_yes")
        .text("НЕТ", "button_no");
    await ctx.reply(stoimostO2, { reply_markup: keyboard });
});

// ------ Для Водорода ------
bot.callbackQuery("button_energetika", async (ctx) => {
    ctx.session.industry = "Энергетика";
    const keyboard = new InlineKeyboard()
        .text("ДА", "button_yes")
        .text("НЕТ", "button_no");
    await ctx.reply(stoimostVod, { reply_markup: keyboard });
});

bot.callbackQuery("button_electro", async (ctx) => {
    ctx.session.industry = "Электроника";
    const keyboard = new InlineKeyboard()
        .text("ДА", "button_yes")
        .text("НЕТ", "button_no");
    await ctx.reply(stoimostVod, { reply_markup: keyboard });
});

// ------ Для Осушителя ------
bot.callbackQuery("button_ahr", async (ctx) => {
    ctx.session.industry = "Адсорбционный (холодная регенерация)";
    const keyboard = new InlineKeyboard()
        .text("ДА", "button_yesOsush")
        .text("НЕТ", "button_noOsush");
    await ctx.reply(stoimostOsu, { reply_markup: keyboard });
});

bot.callbackQuery("button_agr", async (ctx) => {
    ctx.session.industry = "Адсорбционный (горячая регенерация)";
    const keyboard = new InlineKeyboard()
        .text("ДА", "button_yesOsush")
        .text("НЕТ", "button_noOsush");
    await ctx.reply(stoimostOsu, { reply_markup: keyboard });
});

// ==================== Обработка ответов "ДА/НЕТ" ====================
bot.callbackQuery(["button_yes", "button_yesOsush"], async (ctx) => {
    ctx.session.knowsParams = true;
    await ctx.reply("1. Введите производительность (нм³/час):");
});

bot.callbackQuery(["button_no", "button_noOsush"], async (ctx) => {
    ctx.session.knowsParams = false;
    await ctx.reply("Введите ваши контакты (email/телефон):");
});

// ==================== Сбор данных ====================
bot.on("message:text", async (ctx) => {
    if (!ctx.session.performance && ctx.session.knowsParams) {
        ctx.session.performance = ctx.message.text;
        await ctx.reply("2. Введите точку росы (-40 или -70):");
    } else if (!ctx.session.dewPoint && ctx.session.performance) {
        ctx.session.dewPoint = ctx.message.text;
        await ctx.reply("3. Введите давление (MPa):");
    } else if (!ctx.session.pressure && ctx.session.dewPoint) {
        ctx.session.pressure = ctx.message.text;
        await ctx.reply("4. Введите чистоту газа (%):");
    } else if (!ctx.session.purity && ctx.session.pressure) {
        ctx.session.purity = ctx.message.text;
        await ctx.reply("5. Введите ваши контакты:");
    } else if (!ctx.session.contacts) {
        ctx.session.contacts = ctx.message.text;

        // Все данные собраны → отправляем в amoCRM
        console.log(ctx.session)
        // await sendToAmoCRM(ctx.session);
        await ctx.reply("✅ Данные отправлены! Менеджер свяжется с вами.");

        // Очищаем сессию
        ctx.session = {};
    }
});

// ==================== Отправка в amoCRM ====================
async function sendToAmoCRM(data: SessionData) {
    const AMO_API_URL = "https://yourdomain.amocrm.ru/api/v4/leads";
    const AMO_API_KEY = process.env.FETCH_API_TOKEN; // Замените на реальный ключ

    const leadData = {
        name: `Заявка на ${data.selectedGas}`,
        custom_fields_values: [
            {
                field_id: 123456, // Замените на ID поля в amoCRM
                values: [{ value: data.performance }],
            },
            {
                field_id: 123457,
                values: [{ value: data.dewPoint }],
            },
            // Добавьте остальные поля...
        ],
    };

    try {
        await axios.post(AMO_API_URL, leadData, {
            headers: {
                Authorization: `Bearer ${AMO_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Ошибка отправки в amoCRM:", error);
    }
}

// Запуск бота
bot.start();