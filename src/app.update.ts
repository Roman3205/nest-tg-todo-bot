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

  @Hears('Todo list 📋')
  async getAll(ctx: Context) {
    if (!ctx.chat?.id) return;
    const todos = await this.appService.findAll(String(ctx.chat.id));
    await ctx.reply(showTodoList(todos));
  }

  @Hears('Done ✅')
  async doneTask(ctx: Context) {
    ctx.session.type = 'idle';
    if (!ctx.chat?.id) return;
    const todos = await this.appService.findAll(String(ctx.chat.id), false);
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

  @Hears('Edit todo ✏️')
  async editTask(ctx: Context) {
    ctx.session.type = 'idle';
    if (!ctx.chat?.id) return;
    const todos = await this.appService.findAll(String(ctx.chat.id));
    if (todos.length < 1) {
      await ctx.reply('You have no tasks');
      return;
    }
    await ctx.reply(
      'Choose task to edit',
      Markup.inlineKeyboard(
        [
          ...todos.map((task) =>
            Markup.button.callback(task.title, String(`edit_${task.title}`)),
          ),
        ],
        { columns: 3 },
      ),
    );
  }

  @Hears('Create ➕')
  async createTask(ctx: Context) {
    await ctx.reply('Enter task title');
    ctx.session.type = 'create';
  }

  @Hears('Delete todo ❌')
  async deleteTask(ctx: Context) {
    ctx.session.type = 'idle';
    if (!ctx.chat?.id) return;
    const todos = await this.appService.findAll(String(ctx.chat.id));
    if (todos.length < 1) {
      await ctx.reply('You have no tasks');
      return;
    }
    await ctx.reply(
      'Choose task to delete',
      Markup.inlineKeyboard(
        [
          ...todos.map((task) =>
            Markup.button.callback(task.title, String(`remove_${task.title}`)),
          ),
        ],
        { columns: 3 },
      ),
    );
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type || !ctx.chat?.id) return;
    if (ctx.session.type === 'create') {
      const todos = await this.appService.createTask(message, String(ctx.chat.id));
      await ctx.reply(showTodoList(todos));
    }

    ctx.session.type = 'idle';
  }

  @On('callback_query')
  async actionDone(@Ctx() ctx: Context) {
    ctx.session.type = 'idle';
    // @ts-expect-error callbackquery
    const data = ctx.callbackQuery.data as string;
    if (!ctx.chat?.id) return;
    if (data.includes('done_')) {
      const message = data.replace('done_', '');
      const todos = await this.appService.doneTask(message, String(ctx.chat.id));
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Task not found');
        return;
      }

      await ctx.reply(showTodoList(todos));
    } else if (data.includes('remove_')) {
      const message = data.replace('remove_', '');
      const todos = await this.appService.deleteTask(message, String(ctx.chat.id));
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Task not found');
        return;
      }

      await ctx.reply(showTodoList(todos));
    } else if (data.includes('edit_')) {
      const message = data.replace('edit_', '');
      const todos = await this.appService.deleteTask(message, String(ctx.chat.id));
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Task not found');
        return;
      }

      await ctx.reply('Edit task title');
      ctx.session.type = 'create';
    }
  }
}
