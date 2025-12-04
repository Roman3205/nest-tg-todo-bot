import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AppService {
  constructor(private readonly db: DatabaseService) {}

  async createTask(title: string, chatId: string) {
    await this.db.task.create({
      data: {
        title,
        chatId,
      },
    });
    return this.findAll(chatId);
  }

  findAll(chatId: string, withCompleted?: boolean) {
    return this.db.task.findMany({ where: { chatId: chatId, isCompleted: withCompleted } });
  }

  async doneTask(message: string, chatId: string) {
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

  async deleteTask(message: string, chatId: string) {
    await this.db.task.deleteMany({
      where: {
        title: message,
        chatId,
      },
      limit: 1,
    });
    return this.findAll(chatId);
  }
}
