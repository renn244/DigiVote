import { neon } from '@neondatabase/serverless';
import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DatabaseURL = process.env.DATABASE_URL || 'postgresql://postgres:Renato000@localhost:5432/STI-voting?schema=public'
const sql = neon(DatabaseURL)

const dbProvider = {
    provide: 'POSTGRES_POOL',
    useValue: sql
} as Provider

@Global()
@Module({
    providers: [{
        provide: 'POSTGRES_POOL',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            const db_Url = configService.get('DATABASE_URL')
            return neon(db_Url);
        }
    }],
    exports: [dbProvider]
})
export class DatabaseModuleModule {}
