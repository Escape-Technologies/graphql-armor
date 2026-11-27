import { join } from 'node:path';

import { ApolloArmor } from '@escape.tech/graphql-armor';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';

const armor = new ApolloArmor();

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      // Resolved against this file so tests can boot the module from any cwd.
      typePaths: [join(__dirname, '**', '*.graphql')],
      driver: ApolloDriver,
      autoSchemaFile: join(__dirname, '..', 'schema.gql'),
      ...armor.protect(),
      context: ({ req }: any) => ({ req }),
    }),
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
