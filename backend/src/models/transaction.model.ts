import { TransactionType } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from 'type-graphql'
import { CategoryModel } from './category.model'
import { UserModel } from './user.model'

registerEnumType(TransactionType, {
  name: 'TransactionType',
  description: 'Type of transaction (income/expense)',
})

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  description?: string

  @Field(() => String)
  amount!: Decimal

  @Field(() => GraphQLISODateTime)
  date!: Date

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date

  @Field(() => TransactionType)
  type!: TransactionType

  @Field(() => String)
  userId!: string

  @Field(() => UserModel, { nullable: true })
  user?: UserModel

  @Field(() => String)
  categoryId!: string

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel
}
