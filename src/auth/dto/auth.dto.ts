import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	@IsString()
	email: string

	@MinLength(6, {
		message: 'Should be more than 6 symbol',
	})
	@IsString()
	password: string
}