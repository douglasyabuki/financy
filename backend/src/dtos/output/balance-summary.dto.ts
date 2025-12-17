import { Decimal } from '@prisma/client/runtime/library'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class BalanceSummary {
  @Field(() => String)
  balance!: Decimal

  @Field(() => String)
  monthIncome!: Decimal

  @Field(() => String)
  monthExpense!: Decimal
}
