import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const COUNTDOWN_SECONDS = 30;
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "click",
] as const;

export function useInactivityLogout(active: boolean) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  // Prevents activity events from resetting the timer once the warning is visible
  const warningActiveRef = useRef(false);

  const startLogoutCountdown = useCallback(() => {
    warningActiveRef.current = true;
    setShowWarning(true);
    setCountdown(COUNTDOWN_SECONDS);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          countdownIntervalRef.current = null;
          // replace() so pressing Back after login won't return to the protected page
          signOut({ redirect: false }).then(() => {
            window.location.replace("/login");
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (warningActiveRef.current) return;
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(
      startLogoutCountdown,
      INACTIVITY_TIMEOUT_MS,
    );
  }, [startLogoutCountdown]);

  const keepSignedIn = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    warningActiveRef.current = false;
    setShowWarning(false);
    setCountdown(COUNTDOWN_SECONDS);
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  useEffect(() => {
    if (!active) return;

    resetInactivityTimer();
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer, { passive: true }),
    );

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer),
      );
    };
  }, [active, resetInactivityTimer]);

  return { showWarning, countdown, keepSignedIn };
}
