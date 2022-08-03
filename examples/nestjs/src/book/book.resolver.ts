import { Args, Query, Resolver } from '@nestjs/graphql';

import { BookService } from './book.service';
import { Book } from './book.model';
import { Injectable } from '@nestjs/common';

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
