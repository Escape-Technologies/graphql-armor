import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
// import { ConferenceModule } from './conference/conference.module';
// import { SessionModule } from './session/session.module';
// import { SpeakerModule } from './speaker/speaker.module';

console.log(process.env.ENGINE_API_KEY);
@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      engine: {
        apiKey: process.env.ENGINE_API_KEY,
      },
      context: ({ req }) => ({ req }),
    }),
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
