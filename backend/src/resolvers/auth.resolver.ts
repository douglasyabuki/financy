import { injectable } from 'tsyringe'
import { Arg, Mutation, Resolver } from 'type-graphql'
import {
  ForgotPasswordInput,
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
  ResetPasswordInput,
} from '../dtos/input/auth.input'
import { LoginOutput, RegisterOutput } from '../dtos/output/auth.output'
import { AuthService } from '../services/auth.service'

@injectable()
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginOutput)
  async login(
    @Arg('data', () => LoginInput) data: LoginInput
  ): Promise<LoginOutput> {
    return this.authService.login(data)
  }

  @Mutation(() => RegisterOutput)
  async register(
    @Arg('data', () => RegisterInput) data: RegisterInput
  ): Promise<RegisterOutput> {
    return this.authService.register(data)
  }

  @Mutation(() => LoginOutput)
  async refreshToken(
    @Arg('data', () => RefreshTokenInput) data: RefreshTokenInput
  ): Promise<LoginOutput> {
    return this.authService.refreshToken(data.refreshToken)
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('data', () => ForgotPasswordInput) data: ForgotPasswordInput
  ): Promise<boolean> {
    return this.authService.forgotPassword(data.email)
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg('data', () => ResetPasswordInput) data: ResetPasswordInput
  ): Promise<boolean> {
    return this.authService.resetPassword(
      data.email,
      data.code,
      data.password,
      data.confirmPassword
    )
  }
}
