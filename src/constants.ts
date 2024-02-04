import { Prisma } from '@prisma/client'

export const returnedUserFields: Prisma.UserSelect = {
	id: true,
	email: true,
	avatarPath: true,
	firstName: true,
	secondName: true,
	phone: true,
	password: false
}

export const returnedCtgFields: Prisma.CategorySelect = {
	id: true,
	name: true,
	slug: true
}