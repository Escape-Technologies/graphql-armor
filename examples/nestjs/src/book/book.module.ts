import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';

// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Speaker } from './speaker.model';

@Module({
  // imports: [TypeOrmModule.forFeature([Speaker])],
  providers: [BookService, BookResolver],
})
export class BookModule {}
