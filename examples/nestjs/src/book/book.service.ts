import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Book } from './book.model';

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    id: '1',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    id: '2',
  },
];
const logger = new Logger('BookService');

@Injectable()
export class BookService {
  // constructor(
  //   @InjectRepository(Book)
  // ) {}

  public async findAll(): Promise<Book[]> {
    logger.debug('findAll');
    return books.map((book) => ({ ...book, id: book.id.toString() }));
  }

  public async findById(id: String): Promise<Book | undefined> {
    logger.debug('findById');
    return books.find((book) => book.id === id);
  }
}
