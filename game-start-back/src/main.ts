import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import * as cookieParser from 'cookie-parser';
import { AppModule } from "./app.module"

async function start() {
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule)
    app.enableCors({
        credentials:true,
        origin:process.env.CLIENT_URL
    })
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe)
    const config = new DocumentBuilder()
    .setTitle("GameStart")
    .setDescription('statrtup')
    .setVersion('1.0.0')
    .addTag("Endpoints")
    .build()
    const document = SwaggerModule.createDocument(app,config)
    SwaggerModule.setup('/docs',app,document)
    await app.listen(PORT,()=>console.log(`Server started on port ${PORT}`))
}

start()