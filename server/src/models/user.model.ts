import { Field, GraphQLISODateTime, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id!: String

  @Field(() => String)
  name!: String

  @Field(() => String)
  email!: String

  @Field(() => String)
  password!: String

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date
}
