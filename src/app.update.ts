import { AppService } from './app.service';
import { Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';
import type { Context } from './types/contextSession';

@Update()
export class AppController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async stastCommand(ctx: Context) {
    await ctx.reply('Hello user 🙌🏻');
    await ctx.reply('What are the tasks for today?', actionButtons());
  }

  @Hears('Todo list 📋')
  async getAll(ctx: Context) {
    const todos = [];
    // await ctx.reply(`Your todo list: \n\n${todos.map((todo) => (todo.isCompleted ? '✅' : '🔘') + ' ' + todo.name + '\n\n').join('')}`)
  }

  @Hears('Done ✅')
  async doneTask(ctx: Context) {
    await ctx.reply('Send task id: ');
    ctx.session.type = 'done';
  }

  @On('text')
  async getMessage(@Message('text') message: string, ctx: Context) {
    if (!ctx.session.type) return;
    if (ctx.session.type === 'done') {
    }
  }
}
