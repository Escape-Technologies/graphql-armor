import { Module } from '@nestjs/common';

import { BookResolver } from './book.resolver';
import { BookService } from './book.service';

@Module({
  providers: [BookService, BookResolver],
})
export class BookModule {}
