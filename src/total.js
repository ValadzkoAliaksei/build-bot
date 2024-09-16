import { Scenes, Composer } from 'telegraf';

import { getValuesData } from './get-values-data';

const stepHandler = new Composer();

stepHandler.command('total', async (ctx) => {
  return await ctx.scene.leave();
});

const total = new Scenes.WizardScene('total', async (ctx) => {
  const [sheet] = await getValuesData();
  await ctx.reply(`Итоговая сумма затрат ${sheet.data[0].rowData[1].values[4].formattedValue} бел.руб.`);
  return await ctx.scene.leave();
});
total.command('exit', Scenes.Stage.leave());
export { total };
