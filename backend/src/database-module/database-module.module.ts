import { neon } from '@neondatabase/serverless';
import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
    exports: ['POSTGRES_POOL']
})
export class DatabaseModuleModule {}
