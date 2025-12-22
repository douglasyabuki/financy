import { TransactionType, User } from '@prisma/client'
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import {
  CreateTransactionInput,
  GetTransactionsFilterInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'
import { BalanceSummary } from '../dtos/output/balance-summary.dto'
import { CategorySummary } from '../dtos/output/category-summary.dto'
import { GraphqlUser } from '../graphql/decorators/user.decorator'
import { IsAuthenticated } from '../middlewares/auth.middleware'
import { CategoryModel } from '../models/category.model'
import {
  PaginatedTransactions,
  TransactionModel,
} from '../models/transaction.model'
import { UserModel } from '../models/user.model'
import { CategoryService } from '../services/category.service'
import { TransactionService } from '../services/transaction.service'
import { UserService } from '../services/user.service'

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuthenticated)
export class TransactionResolver {
  private transactionService = new TransactionService()
  private userService = new UserService()
  private categoryService = new CategoryService()

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
    @Arg('categoryId', () => String) categoryId: string,
    @GraphqlUser() user: User
  ): Promise<TransactionModel> {
    return this.transactionService.createTransaction(
      data,
      user.id,
      categoryId,
      data.type.toLowerCase() as TransactionType
    )
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput
  ): Promise<TransactionModel> {
    return this.transactionService.updateTransaction(
      id,
      data,
      data.type ? (data.type.toLowerCase() as TransactionType) : 'expense'
    )
  }

  @Mutation(() => TransactionModel)
  async deleteTransaction(
    @Arg('id', () => String) id: string
  ): Promise<TransactionModel> {
    return this.transactionService.deleteTransaction(id)
  }

  @Query(() => PaginatedTransactions)
  async listTransactions(
    @GraphqlUser() user: User,
    @Arg('limit', () => Number, { defaultValue: 10 }) limit: number,
    @Arg('offset', () => Number, { defaultValue: 0 }) offset: number,
    @Arg('filters', () => GetTransactionsFilterInput, { nullable: true })
    filters?: GetTransactionsFilterInput
  ): Promise<PaginatedTransactions> {
    return this.transactionService.listTransactions(
      user.id,
      limit,
      offset,
      filters
    )
  }

  @Query(() => BalanceSummary)
  async balanceSummary(@GraphqlUser() user: User): Promise<BalanceSummary> {
    return this.transactionService.getBalanceSummary(user.id)
  }

  @Query(() => [CategorySummary])
  async categorySummary(@GraphqlUser() user: User): Promise<CategorySummary[]> {
    return this.transactionService.getCategorySummary(user.id)
  }

  @FieldResolver(() => UserModel)
  async user(@Root() transaction: TransactionModel): Promise<UserModel> {
    return this.userService.findUser(transaction.userId)
  }

  @FieldResolver(() => CategoryModel)
  async category(
    @Root() transaction: TransactionModel
  ): Promise<CategoryModel> {
    return this.categoryService.getCategory(
      transaction.categoryId,
      transaction.userId
    )
  }
}
