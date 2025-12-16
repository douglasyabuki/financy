import { Field, GraphQLISODateTime, ID, ObjectType } from 'type-graphql'
import { CategoryModel } from './category.model'
import { TransactionModel } from './transaction.model'

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id!: String

  @Field(() => String)
  name!: String

  @Field(() => String)
  email!: String

  @Field(() => String, { nullable: true })
  password?: String

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date

  @Field(() => [TransactionModel], { nullable: true })
  transactions?: TransactionModel[]

  @Field(() => [CategoryModel], { nullable: true })
  categories?: CategoryModel[]
}
