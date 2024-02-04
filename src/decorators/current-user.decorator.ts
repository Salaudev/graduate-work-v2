import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '@prisma/client'

export const CurrentUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user

		const token = request.headers.authorization?.split(' ')[1];

		console.log(token, 'token');
		console.log(user, '  user')

		return data ? user[data] : user
	}
)

