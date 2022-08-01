import { Module, Logger } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ArmoredConfig } from '@escape.tech/graphql-armor';

const logger = new Logger('AppModule');

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ req }),
      playground: true,
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      useFactory: () => {
        logger.log('Creating schema');
        return ArmoredConfig({
          validationRules: [],
          debug: !!process.env.APOLLO_DEBUG,
          introspection: !process.env.DISABLE_INTROSPECTION,
        });
      }
    }),
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
