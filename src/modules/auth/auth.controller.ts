import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ExistingUserDto } from 'src/modules/users/dto/existingUserDto.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto/createUserDto.dto';
import { Public } from 'src/common/decorators/public/public.decorator';

/**
 * Controller that handles authentication-related HTTP requests such as user sign-up and sign-in.
 */
@ApiTags(
  'Auth (Copy access_token from the response and include it in the Authorization header of your HTTP requests)',
)
@Controller('api/auth')
export class AuthController {
  /**
   * Constructs the AuthController.
   *
   * @param authService - The service responsible for handling authentication logic.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user sign-up.
   *
   * @param body - The data transfer object containing user sign-up details.
   * @returns The result of the sign-up process.
   */
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: 200, description: 'Successful sign up and sign in' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: CreateUserDto })
  @Public()
  @Post('signup')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  /**
   * Handles user sign-in.
   *
   * @param body - The data transfer object containing user sign-in details.
   * @returns The result of the sign-in process.
   */
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, description: 'Successful sign in' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'Invalid user' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ type: ExistingUserDto })
  @Public()
  @Post('signin')
  signIn(@Body() body: ExistingUserDto) {
    return this.authService.signIn(body);
  }
}
