import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ApolloArmor } from '@escape.tech/graphql-armor';

const armor = new ApolloArmor({
  CharacterLimit: {
    enabled: true,
    options: {
      maxLength: 10000 
    }
  }
});

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ req }),
      playground: true,
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',

      // Prepend the armored properties directly to the configuration
      validationRules: armor.getValidationRules(),
      plugins: armor.getPlugins()
    }),
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
