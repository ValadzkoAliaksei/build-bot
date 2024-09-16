import dotenv from 'dotenv';
import { Telegraf, session, Scenes } from 'telegraf';
import { total } from './total';
import { addSum } from './add-sum';
dotenv.config();
const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

const stage = new Scenes.Stage([total, addSum]);
bot.use(session());
bot.use(stage.middleware());

bot.command('start', (ctx) => {
  return ctx.reply(`Привет! Это бот учёта затрат.
У меня  есть такие команды:

/addSum - добавить товар
/total - вывод итоговой суммы`);
});

bot.command('addSum', (ctx) => {
  ctx.scene.enter('addSum');
});

bot.command('total', (ctx) => {
  ctx.scene.enter('total');
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
