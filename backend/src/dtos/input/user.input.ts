import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string
}

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  name?: string
}
