import { User } from '@prisma/client'
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { UpdateUserInput } from '../dtos/input/user.input'
import { UpdateProfileOutput } from '../dtos/output/user.output'
import { GraphqlUser } from '../graphql/decorators/user.decorator'
import { IsAuthenticated } from '../middlewares/auth.middleware'
import { UserModel } from '../models/user.model'
import { UserService } from '../services/user.service'

@Resolver(() => UserModel)
@UseMiddleware(IsAuthenticated)
export class UserResolver {
  private userService = new UserService()

  @Query(() => UserModel)
  async getUser(@Arg('id', () => String) id: string): Promise<UserModel> {
    return this.userService.findUser(id)
  }

  @Mutation(() => UserModel)
  async updateUser(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateUserInput) data: UpdateUserInput
  ): Promise<UserModel> {
    return this.userService.updateUser(id, data)
  }

  @Mutation(() => UpdateProfileOutput)
  async updateProfile(
    @GraphqlUser() user: User,
    @Arg('data', () => UpdateUserInput) data: UpdateUserInput
  ): Promise<UpdateProfileOutput> {
    if (!user) throw new Error('User not authenticated')
    const updatedUser = await this.userService.updateUser(user.id, data)
    return { user: updatedUser }
  }
}
