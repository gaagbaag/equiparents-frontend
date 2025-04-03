"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  startAccept,
  acceptSuccess,
  acceptFailure,
} from "@/redux/invitationSlice";
import { RootState } from "@/redux/store";
import InvitationForm from "@/components/invitations/InvitationForm";

export default function InvitePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accepted, error, loading } = useSelector(
    (state: RootState) => state.invitation
  );

  const [inviteCode, setInviteCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(startAccept());

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ invitationCode: inviteCode }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al aceptar");

      dispatch(acceptSuccess(inviteCode));
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      dispatch(acceptFailure(err.message));
    }
  };

  return (
    <main className="container page-center">
      <InvitationForm
        inviteCode={inviteCode}
        setInviteCode={setInviteCode}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        success={accepted}
      />
    </main>
  );
}
