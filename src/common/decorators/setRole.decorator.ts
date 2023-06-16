import { SetMetadata } from "@nestjs/common";
import { UserRole } from "@prisma/client";

export const ROLE_METADATA_KEY = `ROLES`;

export type Roles = UserRole | `ANY`;

export const setRole = (roles: Roles[]) =>
  SetMetadata(ROLE_METADATA_KEY, roles);
