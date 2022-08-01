import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';

@Module({
  providers: [BookService, BookResolver],
})
export class BookModule {}
