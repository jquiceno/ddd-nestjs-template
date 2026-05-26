import '../instrument'

import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './modules/app.module'
import { AppConfig, HttpConfig } from './config/config.types'
import { LoggerService } from './modules/logging/logger.service'
import { validationPipeOptions } from './config/validation/validationPipe.options'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const loggerService = app.get(LoggerService)

  const httpConfig = configService.getOrThrow<HttpConfig>('http')
  const appConfig = configService.getOrThrow<AppConfig>('app')

  app.useLogger(loggerService)

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions))

  app.enableShutdownHooks()

  if (appConfig.swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(appConfig.name)
      .setVersion('1.0')
      .build()

    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('docs', app, document)
  }

  await app.listen(httpConfig.port)

  loggerService.log(`Server is running on port ${httpConfig.port}`)
}

void bootstrap().catch((error) => {
  console.error(error)
  process.exit(1)
})
