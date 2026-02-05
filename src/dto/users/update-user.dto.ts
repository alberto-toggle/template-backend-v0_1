export interface UpdateUserDto {
  email?: string;
  adObjectId?: string | null;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}
