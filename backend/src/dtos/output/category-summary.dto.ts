import { Decimal } from '@prisma/client/runtime/library'
import { Field, Int, ObjectType } from 'type-graphql'
import { CategoryModel } from '../../models/category.model'

@ObjectType()
export class CategorySummary {
  @Field(() => CategoryModel)
  category!: CategoryModel

  @Field(() => Int)
  count!: number

  @Field(() => String)
  totalAmount!: Decimal
}
