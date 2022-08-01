import { Injectable } from '@nestjs/common';
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

@Injectable()
export class BookService {
  // constructor(
  //   @InjectRepository(Book)
  // ) {}

  public async findAll(): Promise<Book[]> {
    console.log(`Querying all books`);
    return books.map((book) => ({ ...book, id: book.id.toString() }));
  }

  public async findById(id: String): Promise<Book | undefined> {
    console.log(`Querying book with ${id}`);
    return books.find((book) => book.id === id);
  }
}
