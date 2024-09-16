import { Scenes, Composer } from 'telegraf';

import { setValuesData } from './set-values-data';

const TEXTS = {
  setName: 'Введите наименование товара',
  setSum: 'Введите сумму',
};

let name, sum;

const stepHandler = new Composer();

stepHandler.command('addSum', async (ctx) => {
  return await ctx.scene.leave();
});

const addSum = new Scenes.WizardScene(
  'addSum',
  async (ctx) => {
    await ctx.reply(TEXTS.setName);
    return ctx.wizard.next();
  },

  async (ctx) => {
    ctx.session.name = ctx.update?.message?.text;
    await ctx.reply(TEXTS.setSum);
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.sum = ctx.update?.message?.text;
    await setValuesData(ctx.session.name, ctx.session.sum);
    await ctx.reply('Успех');
    return await ctx.scene.leave();
  }
);
addSum.command('exit', Scenes.Stage.leave());
export { addSum };
