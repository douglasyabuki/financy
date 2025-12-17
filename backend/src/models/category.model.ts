import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from 'type-graphql'
import { TransactionModel } from './transaction.model'
import { UserModel } from './user.model'

export enum CategoryColor {
  BLUE = 'blue',
  GREEN = 'green',
  ORANGE = 'orange',
  PINK = 'pink',
  PURPLE = 'purple',
  RED = 'red',
  YELLOW = 'yellow',
}

registerEnumType(CategoryColor, {
  name: 'CategoryColor',
  description: 'Allowed colors for categories',
})

@ObjectType()
export class CategoryModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  description!: string

  @Field(() => String)
  icon!: string

  @Field(() => CategoryColor)
  color!: CategoryColor

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date

  @Field(() => String)
  userId!: string

  @Field(() => UserModel, { nullable: true })
  user?: UserModel

  @Field(() => [TransactionModel], { nullable: true })
  transactions?: TransactionModel[]
}
