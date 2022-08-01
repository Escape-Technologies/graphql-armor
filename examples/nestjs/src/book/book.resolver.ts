import { Args, Query, Resolver } from '@nestjs/graphql';

import { BookService } from './book.service';
import { Book } from './book.model';
import { Injectable } from '@nestjs/common';

@Injectable()
@Resolver('Book')
export class BookResolver {
  constructor(private readonly booksService: BookService) {}

  @Query(() => [Book], { nullable: true })
  public async findAll() {
    return this.booksService.findAll();
  }

  @Query(() => Book)
  public async findOne(@Args('id') id: string) {
    return this.booksService.findById(id);
  }
}
