export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
}
