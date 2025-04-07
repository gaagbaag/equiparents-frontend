"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchParentalAccount } from "@/redux/slices/parentalAccountSlice";
import fetchWithToken from "@/utils/fetchWithToken";

import styles from "@/styles/components/DashboardOverview.module.css";
import Modal from "../Modal";
import InviteParentForm from "../invitations/InviteParentForm";
import ActiveInvitationCard from "../invitations/ActiveInvitationCard";
import ExpiredInvitationCard from "../invitations/ExpiredInvitationCard";

type DashboardOverviewProps = {
  onHistoryRefresh?: () => void;
};

export default function DashboardOverview({
  onHistoryRefresh,
}: DashboardOverviewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { children, users, status } = useAppSelector(
    (state) => state.parentalAccount
  );
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showDeclineChildrenModal, setShowDeclineChildrenModal] =
    useState(false);
  const [activeInvitation, setActiveInvitation] = useState<any | null>(null);
  const [expiredMessage, setExpiredMessage] = useState<string | null>(null);

  const fetchActiveInvitation = async () => {
    try {
      const res = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/active`
      );

      if (!res.ok) {
        if (res.status === 404) {
          const data = await res.json();
          setExpiredMessage(data.message);
        }
        return;
      }

      const { data } = await res.json();
      setActiveInvitation(data);
    } catch (err) {
      console.error("❌ Error al obtener invitación activa:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.parentalAccountId) return;

    dispatch(fetchParentalAccount());
    fetchActiveInvitation();
  }, [dispatch, isAuthenticated, user?.parentalAccountId]);

  if (!isAuthenticated || !user) {
    router.push("/api/auth/login");
    return null;
  }

  if (status === "loading") return <p>Cargando resumen...</p>;

  const membersCount = users.length;
  const childrenCount = children.length;

  const renderInviteButton = () => {
    if (membersCount >= 2) return null;

    if (activeInvitation) {
      const expiresAt = new Date(activeInvitation.expiresAt);
      const now = new Date();
      const daysLeft = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const otherParentsName = activeInvitation.firstName;

      return (
        <div className={styles.invitationNotice}>
          <p>
            Enviaste una invitación a {otherParentsName}, <br />
            que caduca en <strong>{daysLeft} día(s)</strong>.
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className={styles.cardsWallet}>
          <button
            type="button"
            className={styles.inviteButton}
            onClick={() => setShowInviteModal(true)}
          >
            <span className={styles.icon}>➕</span> Invitar otro progenitor
          </button>
          <button
            type="button"
            className={styles.softButton}
            onClick={() => setShowDeclineModal(true)}
          >
            No invitar progenitor
          </button>
        </div>
        <ActiveInvitationCard />
        <ExpiredInvitationCard />
      </div>
    );
  };

  return (
    <>
      <section className={styles.overviewCard}>
        <h2>
          👋 Hola, {user.firstName} {user.lastName}
        </h2>
        <p>
          Tienes {membersCount} miembro(s) en la cuenta parental y{" "}
          {childrenCount} hijo(s) registrados.
        </p>

        <div className={styles.actionsRow}>
          {renderInviteButton()}

          <button
            type="button"
            className={styles.inviteButton}
            onClick={() => router.push("/children")}
          >
            <span className={styles.icon}>🧒</span> Agregar hijo/a
          </button>

          <button
            type="button"
            className={styles.softButton}
            onClick={() => setShowDeclineChildrenModal(true)}
          >
            No agregar más hijos
          </button>
        </div>

        {expiredMessage && !activeInvitation && (
          <div className={styles.expiredInfo}>
            <p>{expiredMessage}</p>
          </div>
        )}
      </section>

      {/* Modales */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)}>
        <InviteParentForm
          onSuccess={() => setShowInviteModal(false)}
          onRefresh={() => {
            fetchActiveInvitation();
            onHistoryRefresh?.();
          }}
        />
      </Modal>

      <Modal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
      >
        <div className={styles.confirmationBox}>
          <p>¿Estás seguro de que no deseas invitar a otro progenitor?</p>
          <div className={styles.actionsRow}>
            <button
              className={styles.softButton}
              onClick={async () => {
                try {
                  const res = await fetchWithToken(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/parental-accounts/finalize`,
                    { method: "POST" }
                  );
                  if (res.ok) {
                    setShowDeclineModal(false);
                    router.push("/dashboard");
                  } else {
                    console.error("❌ No se pudo finalizar la cuenta.");
                  }
                } catch (err) {
                  console.error("❌ Error:", err);
                }
              }}
            >
              Confirmar
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => setShowDeclineModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeclineChildrenModal}
        onClose={() => setShowDeclineChildrenModal(false)}
      >
        <div className={styles.confirmationBox}>
          <p>
            ¿Estás seguro de que no deseas agregar más hijos en este momento?
          </p>
          <div className={styles.actionsRow}>
            <button
              className={styles.softButton}
              onClick={async () => {
                try {
                  const res = await fetchWithToken(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/parental-accounts/finalize`,
                    { method: "POST" }
                  );
                  if (res.ok) {
                    setShowDeclineChildrenModal(false);
                    router.push("/dashboard");
                  } else {
                    console.error("❌ No se pudo finalizar la cuenta.");
                  }
                } catch (err) {
                  console.error("❌ Error:", err);
                }
              }}
            >
              Confirmar
            </button>
            <button
              className={styles.secondaryButton}
              onClick={() => setShowDeclineChildrenModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
