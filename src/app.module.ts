import { Module } from '@nestjs/common';
import { AppController } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import LocalSession from 'telegraf-session-local';
import { BOT_TOKEN } from 'config';
@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [
        new LocalSession({ database: 'session_db.json' }).middleware(),
      ],
      token: BOT_TOKEN,
    }),
  ],
  providers: [AppService, AppController],
})
export class AppModule {}
