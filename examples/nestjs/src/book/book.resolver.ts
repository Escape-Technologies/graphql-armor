import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { Book } from './book.model';
import { BookService } from './book.service';

@Injectable()
@Resolver('Book')
export class BookResolver {
  constructor(private readonly booksService: BookService) {}

  @Query((returns) => [Book])
  public async books(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Query((returns) => Book)
  public async book(@Args('id') id: string) {
    return this.booksService.findById(id);
  }
}
