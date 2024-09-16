import { Scenes, Composer } from 'telegraf';
import axios from 'axios';

const TEXTS = {
  haveRegisted: 'Ты уже зарегистрирован. Если возникла проблема, свяжись с организаторами тренинга',
  startRegister:
    'Начинаем регистрацию. Для выхода в любой момент выполни команду /exit\nВведи фамилию и имя. Пример: Петров Иван',
  phoneNumber:
    'Введи номер телефона в международном формате. Он должен совпадать с номером в анкете регистрации на тренинг. Пример: 375291112233',
  inputCorrectPhoneNumber: 'Введи корректный номер',
  notFound: 'Твоя заявка (анкета регистрации) не найдена. Проверь номер телефона и введи заново, если была ошибка',
  inputGithub: 'Введи логин GitHub. Пример: ivan_petrov. Мы проверим профиль на существование',
  completeRegister: 'Спасибо, регистрация завершена. Жди задание на первый спринт',
  githubNotFound: 'Пользователь GitHub не найден, введи корректный логин',
  somethingWrong: 'Что-то пошло не так, свяжитесь с менторами',
};

const stepHandler = new Composer();

stepHandler.command('exit', async (ctx) => {
  return await ctx.scene.leave();
});

const register = new Scenes.WizardScene(
  'register',
  async (ctx) => {
    const tgId = ctx.update.message.chat.id;
    const { data } = await axios.get(`https://${process.env.HOST}/user`, {
      params: { tgId },
    });

    if (data) {
      await ctx.reply(TEXTS.haveRegisted);
      return await ctx.scene.leave();
    }
    await ctx.reply(TEXTS.startRegister);
    return ctx.wizard.next();
  },
  async (ctx) => {
    const name = ctx.update?.message?.text;

    ctx.session.name = name;

    await ctx.reply(TEXTS.phoneNumber);
    return ctx.wizard.next();
  },
  async (ctx) => {
    const phone = ctx.update?.message?.text || '';
    const clearPhone = phone.toString().replace(/\D+/g, '');
    const incorrectNumber = clearPhone.length !== 11 && clearPhone.length !== 12;
    const correct11Number = clearPhone.length === 11 && /^7[0-9]{10}$/.test(clearPhone);
    const correct12Number =
      clearPhone.length === 12 && (/^375(25|29|33|44)[0-9]{7}$/.test(clearPhone) || /^38[0-9]{10}$/.test(clearPhone));
    if (incorrectNumber || (!correct11Number && !correct12Number)) {
      ctx.reply(TEXTS.inputCorrectPhoneNumber);
      return;
    }
    const { data } = await axios.get(`https://${process.env.HOST}/application`, {
      params: { formattedPhone: clearPhone },
    });
    if (!data) {
      ctx.reply(TEXTS.notFound);
      return;
    }
    ctx.session.phone = clearPhone;
    ctx.session.form = data;
    await ctx.reply(TEXTS.inputGithub);
    return ctx.wizard.next();
  },
  async (ctx) => {
    try {
      ctx.session.github = ctx.update?.message?.text;

      const {
        data: { login },
      } = await axios.get(`https://api.github.com/users/${ctx.session.github}`, {
        headers: {
          Authorization: `Bearer ${process.env.GH_TOKEN}`,
        },
      });

      const user = {
        tgId: ctx.update.message.chat.id,
        tgNickname: ctx.update.message.chat.username,
        realName: ctx.session.name,
        phone: ctx.session.phone,
        github: login,
        form: ctx.session.form,
        status: 'active',
      };

      await axios.patch(`https://${process.env.HOST}/application/activate`, {
        formattedPhone: ctx.session.phone,
      });
      await axios.post(`https://${process.env.HOST}/user`, user);
      await ctx.reply(TEXTS.completeRegister);
      return await ctx.scene.leave();
    } catch (e) {
      console.log(e);
      if (e.response?.status === 404) {
        await ctx.reply(TEXTS.githubNotFound);
        return;
      }
      await ctx.reply(TEXTS.somethingWrong);
      return;
    }
  }
);
register.leave((ctx) => ctx.reply('Bye!'));
register.command('exit', Scenes.Stage.leave());
export { register };
