import { Arg, Query, Resolver, UseMiddleware } from 'type-graphql'
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
}
