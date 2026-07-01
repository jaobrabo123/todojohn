import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { corsOptions } from "./config/cors.config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const isProduction = process.env.NODE_ENV === "production";

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.set("trust proxy", "loopback");

    app.use(cookieParser());
    app.use(
        helmet({
            contentSecurityPolicy: isProduction,
        }),
    );

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: errors => new UnprocessableEntityException(errors),
        }),
    );

    app.enableCors(corsOptions);

    if (!isProduction) {
        const config = new DocumentBuilder()
            .setTitle("ToDo John API")
            .setDescription("The API for the Vivaju project")
            .setVersion("1.0")
            .addBearerAuth()
            .addSecurityRequirements("bearer")
            .build();

        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup("api-docs", app, document);
    }

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
