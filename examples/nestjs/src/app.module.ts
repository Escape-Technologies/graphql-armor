import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ApolloDriver } from '@nestjs/apollo';

console.log(process.env.ENGINE_API_KEY);
@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ req }),
      playground: true,
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
