import ProfileForm from "@/components/profile/Profile.comp";

export default function EditProfilePage() {
  return (
    <main className="mx-auto space-y-6">
      <div>
        <h1 className="text-2xl text-black font-semibold">Edit Profile</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your profile, contact information, and social links.
        </p>
      </div>

      <ProfileForm />
    </main>
  );
}