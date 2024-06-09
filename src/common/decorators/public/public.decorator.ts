import { SetMetadata } from '@nestjs/common';

/**
 * The key used to identify whether a route is public or not.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * The Public decorator marks a route as publicly accessible,
 * meaning it does not require authentication.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
