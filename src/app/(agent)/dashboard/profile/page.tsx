"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getAgentProfile } from "@/services/profile/profile.queries";
import { AgentProfile } from "@/type/profileType";

export default function ProfilePage() {
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const data = await getAgentProfile();

        if (!cancelled) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Loading profile...</p>;

  return (
    <main>
      <h1 className="text-black text-lg bold">{profile?.user?.full_name}</h1>
      <h1 className="text-black text-lg bold">{profile?.user?.email}</h1>
      {profile?.user?.avatar_url && (
        <Image
          src={profile.user.avatar_url}
          alt="Agent Profile"
          width={120}
          height={120}
          className="h-32 w-32 rounded-full object-cover"
        />
      )}
    </main>
  );
}