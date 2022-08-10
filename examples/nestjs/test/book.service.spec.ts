import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';

import { BookService } from '../src/book/book.service';

describe('BookService', () => {
  let bookService: BookService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BookService],
    }).compile();

    bookService = moduleRef.get<BookService>(BookService);
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = await bookService.findAll();
      expect(books).toBeDefined();
      expect(books.length).toBe(2);
    });
  });
});
