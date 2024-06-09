import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/enums/roles/roles.enum';
import { ROLES_KEY } from 'src/common/decorators/roles/roles.decorator';

/**
 * A guard that performs role-based access control (RBAC) for routes and controllers.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines whether the current user has the required roles to access the route or controller.
   * @param context - The execution context of the request.
   * @returns A boolean indicating whether access is allowed based on the user's roles.
   */
  canActivate(context: ExecutionContext): boolean {
    // Retrieve the required roles metadata assigned to the route handler or controller.
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    // If no roles are required, access is allowed.
    if (!requiredRoles) {
      return true;
    }

    // Retrieve the user object from the request context.
    const { user } = context.switchToHttp().getRequest();

    // Check if the user's role matches any of the required roles.
    return requiredRoles.includes(user.role);
  }
}
