import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Module({
    providers: [FirebaseService],
    exports: [FirebaseService], // Export the service to be used in other modules
})
export class FirebaseModule { }