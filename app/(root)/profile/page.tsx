"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { CircleUser, BadgeCheck } from "lucide-react";
import AuthCard from "@/components/AuthCard/AuthCard";
import FormField from "@/components/FormField/FormField";
import Button from "@/components/Button/Button";
import { useProfile } from "@/hooks/useProfile";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { queryKeys } from "@/lib/queryKeys";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function ProfilePage() {
  const { update } = useSession();
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [profession, setProfession] = useState("");
  const [mobile, setMobile] = useState("");

  // Initialise fields once profile data arrives
  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    setDateOfBirth(profile.dateOfBirth ?? "");
    setNationality(profile.nationality ?? "");
    setCountryOfResidence(profile.countryOfResidence ?? "");
    setProfession(profile.profession ?? "");
    setMobile(profile.mobileNumber ?? "");
  }, [profile]);

  const initial = {
    name: profile?.name ?? "",
    dateOfBirth: profile?.dateOfBirth ?? "",
    nationality: profile?.nationality ?? "",
    countryOfResidence: profile?.countryOfResidence ?? "",
    profession: profile?.profession ?? "",
    mobileNumber: profile?.mobileNumber ?? "",
  };

  const isDirty =
    name !== initial.name ||
    dateOfBirth !== initial.dateOfBirth ||
    nationality !== initial.nationality ||
    countryOfResidence !== initial.countryOfResidence ||
    profession !== initial.profession ||
    mobile != initial.mobileNumber;

  const handleSave = () => {
    updateProfile(
      { name, dateOfBirth, nationality, countryOfResidence, profession },
      {
        onSuccess: async (updatedUser) => {
          if (name !== initial.name) {
            await update({ name });
          }
          queryClient.setQueryData(queryKeys.profile.me(), updatedUser);
        },
      },
    );
  };

  const userInitials = (profile?.name ?? "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (isLoading) {
    return <LoadingSpinner message="Fetching your profile" />;
  }

  return (
    <div className="pt-24 pb-10 px-4 flex justify-center">
      <AuthCard className="max-w-md gap-6">
        {/* Avatar + identity */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-surface-highest flex items-center justify-center text-headline-sm text-primary font-bold">
            {userInitials || <CircleUser className="w-8 h-8 text-text-muted" />}
          </div>
          <div className="text-center">
            <p className="text-headline-sm text-text">{profile?.name}</p>
            <p className="text-body-sm text-text-muted">{profile?.email}</p>
          </div>
        </div>

        <div className="w-full h-px bg-outline" />

        {/* Fields */}
        <div className="w-full flex flex-col gap-4">
          <FormField
            id="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            value={profile?.email ?? ""}
            disabled
          />

          {/* Phone row */}
          <FormField
            id="mobile"
            label="Mobile Number"
            placeholder="+91 1234567890"
            value={mobile}
            disabled={true}
            onChange={(e) => setMobile(e.target.value)}
          />
          {profile?.phoneVerified && (
            <span className="flex items-center gap-1 text-label-sm text-primary">
              <BadgeCheck className="w-4 h-4" />
              Verified
            </span>
          )}

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
            id="countryOfResidence"
            label="Country of residence"
            placeholder="e.g. India"
            value={countryOfResidence}
            onChange={(e) => setCountryOfResidence(e.target.value)}
          />
          <FormField
            id="profession"
            label="Profession"
            placeholder="e.g. Software Engineer"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-body-sm text-red-400 w-full">{error.message}</p>
        )}

        {isDirty && (
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        )}

        <Button
          variant="error"
          size="md"
          onClick={() => signOut()}
          className="w-full"
        >
          Logout
        </Button>
      </AuthCard>
    </div>
  );
}
