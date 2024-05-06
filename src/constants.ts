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

export const returnedReviewFields: Prisma.ReviewSelect = {
	id: true,
	text: true,
	createdAt: true,
	rating: true,
	user: {
		select: returnedUserFields
	}
}

export const returnedProductFields: Prisma.ProductSelect = {
	id: true,
	createdAt: true,
	images: true,
	price: true,
	name: true,
	description: true,
	slug: true,
	category: {
		select: returnedCtgFields
	},
	reviews: {
		select: returnedReviewFields,
		orderBy: {
			createdAt: 'desc'
		}
	}
}

export const returnedProductAllFields: Prisma.ProductSelect = {
	...returnedProductFields,
	reviews: {
		select: returnedReviewFields
	},
	category: { select: returnedCtgFields }
}
