"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Logo from "@/public/logo.png";
import LogoText from "@/public/logo_text.png";
import Button from "@/components/Button/Button";
import FormField from "@/components/FormField/FormField";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { phoneApi, usersApi } from "@/lib/endpoints";

// ─── Progress indicator ────────────────────────────────────────────────────────

const STEPS = ["phone", "otp", "profile"] as const;
const STEP_LABELS = ["Phone", "Verify", "Profile"];

function ProgressDots({ current }: { current: (typeof STEPS)[number] }) {
  const currentIndex = STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-3">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              i <= currentIndex ? "bg-primary-app" : "bg-surface-highest"
            }`}
          />
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 h-px transition-colors duration-300 ${
                i < currentIndex ? "bg-primary-app" : "bg-surface-highest"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Phone ─────────────────────────────────────────────────────────────

function PhoneStep() {
  const { phone, setPhone, nextStep } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!phone.trim()) return;
    setError("");
    setLoading(true);
    try {
      await phoneApi.sendOtp(phone.trim());
      nextStep();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">Verify your phone</h2>
        <p className="text-body-sm text-text-muted">
          We&apos;ll send a 6-digit code to confirm your number
        </p>
      </div>
      <FormField
        id="phone"
        label="Phone number"
        type="tel"
        placeholder="+1 234 567 8900"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        autoComplete="tel"
      />
      {error && <p className="text-body-sm text-red-400">{error}</p>}
      <Button
        variant="primary"
        size="md"
        onClick={handleSend}
        disabled={!phone.trim() || loading}
      >
        {loading ? "Sending…" : "Send OTP"}
      </Button>
    </div>
  );
}

// ─── Step 2: OTP ───────────────────────────────────────────────────────────────

function OtpStep() {
  const { phone, nextStep } = useOnboardingStore();
  const { update, data: session } = useSession();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    inputRefs.current[nextEmpty]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return;
    setError("");
    setLoading(true);
    try {
      await phoneApi.verifyOtp(phone, code);
      await update({ phoneVerified: true });
      nextStep();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Invalid OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);
    try {
      await phoneApi.sendOtp(phone);
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">Enter the code</h2>
        <p className="text-body-sm text-text-muted">
          Sent to <span className="text-text font-semibold">{phone}</span>
        </p>
      </div>

      {/* 6-box OTP input */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-11 h-13 text-center text-headline-sm bg-surface-highest rounded-xl border border-outline focus:ring-2 focus:ring-primary/50 focus:border-primary/40 outline-none text-text transition-all"
          />
        ))}
      </div>

      {error && (
        <p className="text-body-sm text-red-400 text-center">{error}</p>
      )}

      <Button
        variant="primary"
        size="md"
        onClick={handleVerify}
        disabled={otp.join("").length < 6 || loading}
      >
        {loading ? "Verifying…" : "Verify"}
      </Button>

      <button
        onClick={handleResend}
        disabled={resending}
        className="text-body-sm text-text-muted hover:text-primary transition-colors cursor-pointer disabled:opacity-50 text-center"
      >
        {resending ? "Resending…" : "Didn't receive it? Resend"}
      </button>
    </div>
  );
}

// ─── Step 3: Profile ───────────────────────────────────────────────────────────

function ProfileStep() {
  const router = useRouter();
  const { reset } = useOnboardingStore();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [designation, setDesignation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async () => {
    setError("");
    setLoading(true);
    try {
      await usersApi.updateProfile({ dateOfBirth, nationality, designation });
      reset();
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-headline-sm text-text">Complete your profile</h2>
        <p className="text-body-sm text-text-muted">
          Help us personalise your travel experience
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          id="dob"
          label="Date of birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        <FormField
          id="nationality"
          label="Nationality"
          placeholder="e.g. American"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
        />
        <FormField
          id="designation"
          label="Designation"
          placeholder="e.g. Software Engineer"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
      </div>

      {error && <p className="text-body-sm text-red-400">{error}</p>}

      <Button
        variant="primary"
        size="md"
        onClick={handleComplete}
        disabled={loading}
      >
        {loading ? "Saving…" : "Complete setup"}
      </Button>

      <button
        onClick={handleSkip}
        className="text-body-sm text-text-muted hover:text-primary transition-colors cursor-pointer text-center"
      >
        Skip for now
      </button>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { step } = useOnboardingStore();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass ghost-border shadow-ambient rounded-3xl p-10 w-full max-w-sm flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" className="w-10" />
          <Image src={LogoText} alt="CYV" className="w-28" />
        </div>

        {/* Step label + progress */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-label-md text-text-subtle">
            Step {STEPS.indexOf(step) + 1} of {STEPS.length} —{" "}
            {STEP_LABELS[STEPS.indexOf(step)]}
          </p>
          <ProgressDots current={step} />
        </div>

        {step === "phone" && <PhoneStep />}
        {step === "otp" && <OtpStep />}
        {step === "profile" && <ProfileStep />}
      </div>
    </div>
  );
}
