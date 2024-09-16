import dotenv from 'dotenv';
dotenv.config();
import { Telegraf, session, Scenes, Telegram } from 'telegraf';
import axios from 'axios';

import { register } from './register';
import { Queue } from './queue';

export const queue = new Queue();

const token = process.env.BOT_TOKEN;
export const telegram = new Telegram(token);
const bot = new Telegraf(token);

const stage = new Scenes.Stage([register]);
bot.use(session());
bot.use(stage.middleware());

bot.command('start', (ctx) => {
  return ctx.reply(`Привет! Это основной бот тренинга по Frontend-разработке от компании Clevertec.
Тут ты сможешь зарегистрироваться и получать задания.
У нас есть такие команды:

/register - Регистрация пользователя
/exit - Выход из процесса регистрации
О технических проблемах пиши в чат https://t.me/clevertec_frontend_lab`);
});

bot.command('register', (ctx) => {
  return ctx.reply(`Регистрация закрыта! Следи за нашими новостями, мы сообщим о следующем наборе`);
  // ctx.scene.enter('register');
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
