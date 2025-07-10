import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Use global exception filter
	app.useGlobalFilters(new AllExceptionsFilter());
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,   // Remove extra properties not defined on DTO
		transform: true,      // Type conversion from string to number, etc.
		forbidNonWhitelisted: true, // Returns an error if non-whitelisted properties are present
	}));

	const config = new DocumentBuilder()
		.setTitle('Wallet System API')
		.setDescription('API para gerenciamento de carteira financeira')
		.setVersion('1.0')
		.addTag('users')
		.addTag('transactions')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	
	await app.listen(3000);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
