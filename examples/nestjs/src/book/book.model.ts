import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class Book {
  @Field(() => String)
  id: String;

  @Field(() => String)
  title: String;

  @Field(() => String)
  author: String;
}
