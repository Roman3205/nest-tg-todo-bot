import { AppService } from './app.service';
import {
  Action,
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';
import type { Context } from './types/contextSession';
import { showTodoList } from './app.utils';

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

  @Action('list')
  async getAll(ctx: Context) {
    if (!ctx.chat?.id) return;
    const todos = await this.appService.findAll(ctx.chat.id);
    await ctx.reply(showTodoList(todos));
  }

  @Action('done')
  async doneTask(ctx: Context) {
    ctx.session.type = 'idle';
    if (!ctx.chat?.id) return;
    const todos = await this.appService.findAll(ctx.chat.id, false);
    if (todos.length < 1) {
      await ctx.reply('All tasks are completed');
      return;
    }
    await ctx.reply(
      'Choose task to complete',
      Markup.inlineKeyboard(
        [
          ...todos.map((task) =>
            Markup.button.callback(task.title, String(`done_${task.title}`)),
          ),
        ],
        { columns: 3 },
      ),
    );
  }

  @On('callback_query')
  async actionDone(@Ctx() ctx: Context) {
    ctx.session.type = 'idle';
    // @ts-expect-error test
    const data = ctx.callbackQuery.data as string;
    if (!ctx.chat?.id) return;
    if (data.includes('done_')) {
      const message = data.replace('done_', '');
      const todos = await this.appService.doneTask(message, ctx.chat.id);
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Task not found');
        return;
      }

      await ctx.reply(showTodoList(todos));
    }
  }

  @Action('edit')
  async editTask(ctx: Context) {
    await ctx.reply('Send task id: ');
    ctx.session.type = 'edit';
  }

  @Action('create')
  async createTask(ctx: Context) {
    await ctx.reply('Enter task title');
    ctx.session.type = 'create';
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type || !ctx.chat?.id) return;
    if (ctx.session.type === 'create') {
      const todos = await this.appService.createTask(message, ctx.chat.id);
      await ctx.reply(showTodoList(todos));
    }
    return
  }
}
