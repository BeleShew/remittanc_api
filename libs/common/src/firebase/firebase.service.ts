import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';
@Injectable()
export class FirebaseService implements OnModuleInit {
    private auth: admin.auth.Auth;
    onModuleInit() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as any),
            });
        }
        this.auth = admin.auth();
    }
    getAuth(): admin.auth.Auth {
        return this.auth;
    }
    public getDb(): admin.firestore.Firestore {
        return admin.firestore();
    }

    public async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
        return this.auth.verifyIdToken(idToken);
    }
}