import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
  characterLimit: {
    enabled: true,
    options: {
      maxLength: 1,
    },
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
      context: ({ req }) => ({ req }),
    }),
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
