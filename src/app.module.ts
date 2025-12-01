import { Module } from '@nestjs/common';
import { AppController } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import LocalSession from 'telegraf-session-local';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        middlewares: [
          new LocalSession({ database: 'session_db.json' }).middleware(),
        ],
        token: config.getOrThrow('BOT_TOKEN'),
      }),
    }),
  ],
  providers: [AppService, AppController],
})
export class AppModule {}
