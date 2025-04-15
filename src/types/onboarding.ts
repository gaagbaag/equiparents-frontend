// src/types/onboarding.ts

export interface FamilyOptionsProps {
  onCreate: () => void;
  onJoin: () => void;
  loading: boolean;
  error: string | null;
}

export interface InviteFormProps {
  inviteCode: string;
  setInviteCode: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  success: boolean;
}
