import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * Setup Swagger documentation for the given Nest.js application.
 * @param app The Nest.js application instance.
 */
export function setupSwagger(app: INestApplication) {
  // Define Swagger document options
  const options = new DocumentBuilder()
    .setTitle('User Requests API') // Title of the API
    .setDescription('API for managing user requests') // Description of the API
    .setVersion('1.0') // Version of the API
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, options);

  // Setup Swagger UI endpoint at '/api-documenatation' and expose Swagger document
  SwaggerModule.setup('api-documenatation', app, document);
}
