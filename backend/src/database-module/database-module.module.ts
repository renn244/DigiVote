import { neon } from '@neondatabase/serverless';
import { Global, Module, Provider } from '@nestjs/common';

const DatabaseURL = process.env.DATABASE_URL

const sql = neon(DatabaseURL)

const dbProvider = {
    provide: 'POSTGRES_POOL',
    useValue: sql
} as Provider

@Global()
@Module({
    providers: [dbProvider],
    exports: [dbProvider]
})
export class DatabaseModuleModule {}
