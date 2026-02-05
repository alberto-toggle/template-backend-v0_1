export type AuthProviderResult = {
  ok: boolean;
  email?: string;
  external_user_id?: string | null;
  ad_object_id?: string | null;
};

export interface AuthProvider {
  authenticate(params: { email: string; password: string }): Promise<AuthProviderResult>;
}
