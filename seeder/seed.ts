import { faker } from '@faker-js/faker'
import { PrismaClient, Product } from '@prisma/client'
import * as dotenv from 'dotenv'
import { generateSlug } from '../src/utils/generate-slug'

dotenv.config()

const prisma = new PrismaClient()

const createProducts = async (quantity: number) => {
	const prodcuts: Product[] = []

	for (let i = 0; i < quantity; i++) {
		const productName = faker.commerce.productName()
		const category = faker.commerce.department()

		const product = await prisma.product.create({
			data: {
				slug: generateSlug(productName),
				price: +faker.commerce.price(10, 1000, 0),
				name: productName,
				description: faker.commerce.productDescription(),
				images: Array.from({
					length: faker.number.int({ min: 2, max: 6 })
				}).map(() => faker.image.url()),
				category: {
					create: {
						name: category,
						slug: generateSlug(category)
					}
				},
				reviews: {
					create: [
						{
							rating: faker.number.int({ min: 0, max: 5 }),
							text: faker.lorem.paragraphs(),
							user: {
								connect: {
									id: 1
								}
							}
						},
						{
							rating: faker.number.int({ min: 0, max: 5 }),
							text: faker.lorem.paragraphs(),
							user: {
								connect: {
									id: 1
								}
							}
						}
					]
				}
			}
		})
		prodcuts.push(product)
	}

	console.log('created ' + prodcuts.length + ' products')
}

async function main() {
	console.log('Starting seeding ....')
	await createProducts(20)
}

main()
	.catch(e => console.error(e))
	.finally(async () => await prisma.$disconnect)
