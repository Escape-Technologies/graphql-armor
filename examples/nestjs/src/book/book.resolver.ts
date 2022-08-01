import { Args, Query, Resolver } from '@nestjs/graphql';

import { BookService } from './book.service';
import { Book } from './book.model';

@Resolver('Book')
export class BookResolver {
  constructor(private readonly booksService: BookService) {}

  @Query('books')
  public async findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Query('book')
  public async findOne(@Args('id') id: string): Promise<Book | undefined> {
    return this.booksService.findById(id);
  }
}
