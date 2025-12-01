import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly db: DatabaseService) {}

  async createTask(title: string, chatId: number) {
    await this.db.task.create({
      data: {
        title,
        chatId,
      },
    });
    return this.findAll(chatId);
  }

  findAll(chatId: number, withCompleted?: boolean) {
    const completed = withCompleted == false ? false : true
    return this.db.task.findMany({ where: { chatId: chatId, isCompleted: completed } });
  }

  async doneTask(message: string, chatId: number) {
    await this.db.task.updateMany({
      where: {
        title: message,
        chatId,
      },
      data: {
        isCompleted: true,
      },
      limit: 1,
    });
    return this.findAll(chatId);
  }
}
