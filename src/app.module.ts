import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
	ConfigModule.forRoot({ isGlobal: true }),

	TypeOrmModule.forRootAsync({
		inject: [ConfigService],
		useFactory: (config: ConfigService) => ({
			type: 'postgres',
			host: config.get('DB_HOST'),
			port: +config.get('DB_PORT'),
			username: config.get('DB_USER'),
			password: config.get('DB_PASS'),
			database: config.get('DB_NAME'),
			entities: [__dirname + '/**/*.entity{.ts,.js}'],
			synchronize: true,
		}),
	}),

	UserModule,
	AuthModule,
	TransactionModule,
  ],
})
export class AppModule {}
