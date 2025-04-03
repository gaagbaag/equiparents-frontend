// src/types/jwt.ts
export interface CustomJwtPayload {
  sub: string;
  email: string;
  name: string;
  nickname?: string;
  picture?: string;
  updated_at?: string;
  iss: string;
  aud: string[];
  iat: number;
  exp: number;
  azp?: string;
  scope?: string;
  "https://equiparents.api/roles"?: string[];
  "https://equiparents.api/parentalAccountId"?: string;
}
