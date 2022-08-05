import { ApolloArmor } from '@escape.tech/graphql-armor';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';

const armor = new ApolloArmor({
  characterLimit: {
    enabled: true,
    maxLength: 100,
  },
});

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      typePaths: ['./**/*.graphql'],
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      ...armor.protect(),
      context: ({ req }: any) => ({ req }),
    }),
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
