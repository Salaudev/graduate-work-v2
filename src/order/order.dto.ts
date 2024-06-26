import { EnumOrderStatusses } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	ValidateNested
} from 'class-validator'

export class OrderDto {
	@IsOptional()
	@IsEnum(EnumOrderStatusses)
	status: EnumOrderStatusses

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	items: OrderItemDto[]
}

export class OrderItemDto {
	@IsNumber()
	quantity: number

	@IsNumber()
	price: number

	@IsNumber()
	productId: number
}
