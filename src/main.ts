import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PrismaService } from './prisma.service'
import * as process from 'process'
import { ConfigService } from '@nestjs/config'


const PORT = process.env.PORT || 3000

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const prismaService = app.get(PrismaService)


	await app.listen(PORT, () => console.log(`Server has been started on port : ${PORT}`))
}

bootstrap()
