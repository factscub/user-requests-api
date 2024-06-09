import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

/**
 * Service responsible for user-related operations.
 */
@Injectable()
export class UsersService {
  /**
   * Injects the UserRepository for database operations.
   * @param userRepository The injected UserRepository instance.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Finds a user by email.
   * @param email The email of the user to find.
   * @returns A Promise that resolves to a User entity if found, or undefined if not found.
   */
  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Creates a new user.
   * @param signUpDto The DTO containing user information for sign-up.
   * @returns A Promise that resolves to the created User entity.
   */
  async createUser(signUpDto: CreateUserDto): Promise<User> {
    // Create a new user entity from the DTO
    const user = this.userRepository.create(signUpDto);

    // Save the user entity to the database
    return await this.userRepository.save(user);
  }
}
