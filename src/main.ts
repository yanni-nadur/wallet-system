import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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

	await app.listen(3000);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
