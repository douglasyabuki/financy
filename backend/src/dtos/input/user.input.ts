import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'
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

  @Field(() => GraphQLUpload, { nullable: true })
  avatar?: Promise<FileUpload>

  @Field(() => Boolean, { nullable: true })
  removeAvatar?: boolean
}
