export interface CreateUserDto {
  email: string;
  adObjectId?: string | null;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}
