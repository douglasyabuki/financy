import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  description!: string

  @Field(() => String)
  type!: string

  @Field(() => String)
  amount!: string

  @Field(() => String)
  date!: string
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => String, { nullable: true })
  amount?: string

  @Field(() => String, { nullable: true })
  date?: string
}

@InputType()
export class GetTransactionsFilterInput {
  @Field(() => Number, { nullable: true })
  month?: number

  @Field(() => Number, { nullable: true })
  year?: number

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => String, { nullable: true })
  categoryId?: string

  @Field(() => String, { nullable: true })
  description?: string
}
