/** System user (access account) */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
  DISPATCHER = "DISPATCHER",
  AGENT = "AGENT",
}
