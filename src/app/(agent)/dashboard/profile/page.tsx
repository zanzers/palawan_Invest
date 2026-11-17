"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { getAgentProfile } from "@/services/profile/profile.queries";
import type { AgentProfile } from "@/type/profileType";
import { EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react";
import getSocialIcon from "@/utils/socialIcons.ts/SocialsIcons";

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

  if (loading) {
    return <p className="p-6 text-gray-500">Loading profile...</p>;
  }

  const user = profile?.user;
  const profileInfo = profile?.profileInfo;
  const socialLinks = profile?.socialLinks ?? [];


  return (
    <main className="min-h-screen bg-white text-black">

      {/* COVER */}
      <section className="relative">

        <div className="relative h-48 w-full overflow-hidden bg-gray-200 sm:h-64">

          {user?.banner_url && (
            <Image
              src={user.banner_url}
              alt="Profile cover"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}

        </div>

        {/* PROFILE INFORMATION */}
        <div className="relative px-5 pb-8">

          {/* PROFILE PICTURE */}
          <div className="relative mx-auto -mt-20 h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-gray-200">

            {user?.avatar_url && (
              <Image
                src={user.avatar_url}
                alt="Agent profile"
                fill
                sizes="144px"
                className="object-cover"
              />
            )}

          </div>

          {/* NAME */}
          <div className="mt-4 text-center">

            <h1 className="text-2xl font-bold">
              {user?.full_name || "Agent Name"}
            </h1>

            {profileInfo?.credentials && (
              <p className="mt-1 text-sm text-gray-500">
                {profileInfo.credentials}
              </p>
            )}

          </div>

          {/* CONTACT INFORMATION */}
          <div className="flex flex-col items-center gap-2">

            <div className="items-start">
              
              {profileInfo?.public_email && (
                <a href={`mailto:${profileInfo.public_email}`} className="flex mt-4 items-center gap-2 text-sm text-gray-600 hover:text-black">
                  <EnvelopeSimpleIcon size={20} />
                  {profileInfo.public_email}
                </a>
              )
              }
              {profileInfo?.phone_number && (
                <a href={`mailto:${profileInfo.phone_number}`} className="flex mt-4 items-center gap-2 text-sm text-gray-600 hover:text-black">
                  <PhoneIcon size={20} />
                  {profileInfo.phone_number}
                </a>
              )
              }
            </div>


            

          </div>

          {/* SOCIAL LINKS */}
          {socialLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-3">

              {socialLinks.map((social) => (
               <a
                  key={social.id}
                  href={
                    /^https?:\/\//i.test(social.url)
                      ? social.url
                      : `https://${social.url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.platform}
                  aria-label={social.platform}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-black"
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}

            </div>
          )}

      
        {/* PROFILE ACTIONS */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">

          <Link
            href="/catalog"
            className="rounded-xl border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Catalog
          </Link>

          <Link
            href="/dashboard/profile/edit"
            className="rounded-xl bg-[#1C2216] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#303a27]"
          >
            Edit Profile
          </Link>

        </div>

        </div>
      </section>

      {/* DASHBOARD NAVIGATION */}
      <nav className="sticky top-0 z-30 border-y border-gray-100 bg-white">

        <div className="mx-auto flex max-w-5xl items-center justify-center gap-8 overflow-x-auto px-4">

          <Link
            href="/dashboard/publishing"
            className="whitespace-nowrap border-b-2 border-[#1C2216] px-3 py-4 text-sm font-semibold text-[#1C2216]"
          >
            Publishing
          </Link>

          <Link
            href="/dashboard/messages"
            className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-500 hover:text-black"
          >
            Messages
          </Link>

          <Link
            href="/dashboard/notifications"
            className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-500 hover:text-black"
          >
            Notifications
          </Link>

        </div>

      </nav>

    </main>
  );
}