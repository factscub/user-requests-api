import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExistingUserDto } from 'src/modules/users/dto/existingUserDto.dto';
import { UsersService } from 'src/modules/users/users.service';
import { UserPayload } from 'src/common/types/types';
import { PasswordService } from 'src/common/utils/password.utils';
import { CreateUserDto } from 'src/modules/users/dto/createUserDto.dto';

/**
 * Service responsible for user authentication and authorization.
 */
@Injectable()
export class AuthService {
  /**
   * Initializes the AuthService with required services.
   * @param usersService - The UsersService for managing user data.
   * @param jwtService - The JwtService for generating and verifying JWT tokens.
   * @param passwordService - The PasswordService for hashing and comparing passwords.
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   * Registers a new user.
   * @param signUpDto - The data required for user registration.
   * @returns An object containing the access token upon successful registration.
   * @throws ConflictException if the email address already exists.
   */
  async signUp(signUpDto: CreateUserDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(signUpDto.email);

    if (user) {
      throw new ConflictException('Email already exists');
    }

    const signUpPassword = signUpDto.password;
    signUpDto['password'] =
      await this.passwordService.hashPassword(signUpPassword);
    await this.usersService.createUser(signUpDto);

    return this.signIn({
      email: signUpDto.email,
      password: signUpPassword,
    });
  }

  /**
   * Authenticates a user based on provided credentials.
   * @param signInDto - The credentials provided for user authentication.
   * @returns An object containing the access token upon successful authentication.
   * @throws NotFoundException if the user does not exist.
   * @throws UnauthorizedException if the provided credentials are invalid.
   */
  async signIn(signInDto: ExistingUserDto): Promise<{
    access_token: string;
    user: UserPayload;
  }> {
    const user = await this.usersService.findByEmail(signInDto.email);

    if (!user) {
      throw new NotFoundException('Invalid user');
    }

    const isValidPassword = await this.passwordService.comparePassword(
      signInDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return {
      access_token: await this.jwtService.signAsync(userPayload),
      user: userPayload,
    };
  }
}
