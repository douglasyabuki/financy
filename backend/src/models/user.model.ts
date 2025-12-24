import { Field, GraphQLISODateTime, ID, ObjectType } from 'type-graphql'
import { CategoryModel } from './category.model'
import { TransactionModel } from './transaction.model'

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string

  @Field(() => String, { nullable: true })
  password?: string

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date

  @Field(() => [TransactionModel], { nullable: true })
  transactions?: TransactionModel[]

  @Field(() => [CategoryModel], { nullable: true })
  categories?: CategoryModel[]
}
