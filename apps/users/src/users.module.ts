import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FirebaseModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    FirebaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
