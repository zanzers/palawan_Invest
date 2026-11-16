"use client";

import Image from "next/image";
import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import { INITIAL_DATA, SocialLink, ProfileFormData } from "@/type/profileType";
import { useEffect, useState } from "react";


const inputClass = "w-full rounded-xl border border-neutral-300 bg-white p-3 text-black placeholder:text-neutral-500 outline-none focus:border-black";

const labelClass = "mb-1 block text-sm font-medium text-black";

const sectionTitleClass = "text-lg font-semibold text-black";

export default function ProfileForm() {
  const [form, setForm] = useState(INITIAL_DATA);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [profilePreview, setProfilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [profilePreview, coverPreview]);

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (
    file: File | undefined,
    type: "profile" | "cover"
  ) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be 5MB or smaller.");
      return;
    }

    const preview = URL.createObjectURL(file);

    if (type === "profile") {
      setProfilePreview((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return preview;
      });

      setProfileImage(file);
    } else {
      setCoverPreview((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return preview;
      });

      setCoverImage(file);
    }
  };

  const addOtherLink = () => {
    setForm((prev) => ({
      ...prev,
      otherLinks: [...prev.otherLinks, { platform: "", url: "" }],
    }));
  };

  const updateOtherLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      otherLinks: prev.otherLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  const removeOtherLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      otherLinks: prev.otherLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Profile data:", form);
    console.log("Profile image:", profileImage);
    console.log("Cover image:", coverImage);

    // Supabase integration comes next.
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-black">

      {/* PROFILE IMAGES */}
        <section className="space-y-4">
        <h2 className={sectionTitleClass}>Profile Images</h2>

        <div className="relative w-full">

            {/* COVER PHOTO */}
            <div className="relative h-60 w-full overflow-hidden bg-neutral-200 sm:h-64">

            {coverPreview ? (
                <Image
                    src={coverPreview}
                    alt="Cover preview"
                    className="pointer-events-none h-full w-full object-cover"
                />
            ) : (
                <div className="pointer-events-none flex h-full w-full items-center justify-center text-black">
                Cover Photo
                </div>
            )}

            {/* COVER UPLOAD BUTTON */}
            <label className="absolute bottom-3 right-3 z-20 cursor-pointer rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-black shadow hover:bg-neutral-100">
                <PencilSimpleLineIcon  size={20} weight="bold" />

                <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    handleImageChange(e.target.files?.[0], "cover");
                    e.target.value = "";
                }}
                />
            </label>
            </div>

            {/* CENTERED PROFILE IMAGE */}
                    <div className="relative z-10 -mt-16 flex flex-col items-center">

                    {/* PROFILE PICTURE */}
                    <div className="relative h-32 w-32">

                        <div className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-neutral-200 shadow">
                        {profilePreview ? (
                            <Image
                            src={profilePreview}
                            alt="Profile preview"
                            className="pointer-events-none h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-black">
                            Profile
                            </div>
                        )}
                        </div>

                        {/* EDIT PROFILE IMAGE */}
                        <label
                        title="Change profile picture"
                        className="absolute bottom-1 right-1 z-20 flex h-9 w-9 cursor-pointer items-center justify-center "
                        >
                        <PencilSimpleLineIcon   size={24} weight="bold" />

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                            handleImageChange(e.target.files?.[0], "profile");
                            e.target.value = "";
                            }}
                        />
                        </label>

                    </div>
                    </div>
        </div>
        </section>

      <div className="px-4 py-8">

        {/* BASIC INFORMATION */}
        <section className="space-y-4 ">
            <h2 className={sectionTitleClass}>Basic Information</h2>

            <div>
            <label className={labelClass}>Full Name</label>
            <input
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Enter your full name"
                required
                className={inputClass}
            />
            </div>

            <div>
            <label className={labelClass}>
                Accreditation / Credentials
            </label>
            <input
                value={form.accreditation}
                onChange={(e) => handleChange("accreditation", e.target.value)}
                placeholder="PRC, DHSUD, etc."
                className={inputClass}
            />
            </div>
        </section>

        {/* CONTACT INFORMATION */}
        <section className="space-y-4 pt-8">
            <h2 className={sectionTitleClass}>Contact Information</h2>

            {([
            ["email", "Email Address", "email"],
            ["phone", "Phone Number", "tel"],
            ["whatsapp", "WhatsApp Number", "tel"],
            ["telegram", "Telegram Username or Link", "text"],
            ] as const).map(([field, label, type]) => (
            <div key={field}>
                <label className={labelClass}>{label}</label>
                <input
                type={type}
                value={form[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                className={inputClass}
                />
            </div>
            ))}
        </section>

        {/* SOCIAL MEDIA */}
        <section className="space-y-4 pt-8">
            <h2 className={sectionTitleClass}>Social Media</h2>

            {([
            ["facebook", "Facebook"],
            ["instagram", "Instagram"],
            ] as const).map(([field, label]) => (
            <div key={field}>
                <label className={labelClass}>{label}</label>
                <input
                value={form[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={`Enter ${label} profile URL`}
                className={inputClass}
                />
            </div>
            ))}

            {/* OTHER LINKS */}
            <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-black">Other Links</h3>

                <button
                type="button"
                onClick={addOtherLink}
                className="text-sm font-medium text-black underline"
                >
                + Add Link
                </button>
            </div>

            {form.otherLinks.map((link, index) => (
                <div key={index} className="flex flex-col gap-2 sm:flex-row">
                <input
                    value={link.platform}
                    onChange={(e) =>
                    updateOtherLink(index, "platform", e.target.value)
                    }
                    placeholder="Platform name"
                    className={inputClass}
                />

                <input
                    value={link.url}
                    onChange={(e) =>
                    updateOtherLink(index, "url", e.target.value)
                    }
                    placeholder="Profile URL"
                    className={inputClass}
                />

                <button
                    type="button"
                    onClick={() => removeOtherLink(index)}
                    className="rounded-xl border border-neutral-300 px-4 py-3 text-black hover:bg-neutral-100"
                >
                    Remove
                </button>
                </div>
            ))}
            </div>
        </section>

        {/* FORM ACTIONS */}
        <div className="flex justify-end gap-3 border-t border-neutral-300 pt-5">
            <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-xl border border-neutral-300 px-5 py-3 text-black hover:bg-neutral-100"
            >
            Cancel
            </button>

            <button
            type="submit"
            className="rounded-xl bg-[#1C2216] px-6 py-3 font-medium text-white transition hover:bg-[#303a27]"
            >
            Save Profile
            </button>
        </div>
      </div>

    </form>
  );
}