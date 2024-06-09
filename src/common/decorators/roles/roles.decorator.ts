import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/enums/roles/roles.enum';

/**
 * Key used to access roles metadata.
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator used to assign roles to a route handler or controller.
 * @param roles - The roles assigned to the route handler or controller.
 * @returns A metadata storage object that contains the assigned roles.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
