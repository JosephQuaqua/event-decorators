
import { Camera } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
  const { profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url ?? "");

  useEffect(() => {
    if (!profile) return;

    setFullName(profile.full_name ?? "");
    setPhone(profile.phone ?? "");
    setPosition(profile.position ?? "");
    setDepartment(profile.department ?? "");
    setAddress(profile.address ?? "");
    setBio(profile.bio ?? "");
setAvatarPreview(profile.avatar_url ?? "");
  }, [profile]);

 const handleSave = async () => {
  if (!profile) return;

  setSaving(true);
  let avatarUrl = profile.avatar_url;

if (avatarFile) {
  const fileExt = avatarFile.name.split(".").pop();

  const fileName = `${profile.id}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatarFile, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  avatarUrl = data.publicUrl;
}

  try {
    const { error } = await supabase
      .from("profiles")
     .update({
  full_name: fullName,
  phone,
  position,
  department,
  address,
  bio,
  avatar_url: avatarUrl,
})
      .eq("id", profile.id);

    if (error) throw error;
    await refreshProfile();

    setAvatarPreview(avatarUrl ?? "");

    alert("Profile updated successfully!");
  } catch (error: any) {
    alert(error.message);
  } finally {
    setSaving(false);
  }
};


  return (
   <div className="space-y-8">
  {/* Page Header */}
  <div>
    <h1 className="font-serif text-3xl font-semibold text-charcoal-900">
      My Profile
    </h1>

    <p className="mt-2 text-charcoal-500">
      Manage your personal information and account details.
    </p>
  </div>

 
  {/* Top Section */}
  <div className="grid gap-8 lg:grid-cols-3">

    <div className="card-luxury flex flex-col items-center p-6">
  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-700 text-3xl font-bold text-white">
   {avatarPreview ? (
  <img
    src={avatarPreview}
    alt={profile?.full_name ?? "Profile"}
    className="h-full w-full rounded-full object-cover"
  />
) : (
      fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    )}
  </div>

  <h2 className="mt-5 text-xl font-semibold text-charcoal-900">
    {fullName || "Administrator"}
  </h2>

  <p className="mt-1 text-sm capitalize text-charcoal-500">
    {(profile?.role ?? "").replace("_", " ")}
  </p>

 <label className="mt-6 cursor-pointer rounded-xl border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-700 hover:text-white">
  <div className="flex items-center gap-2">
  <Camera className="h-4 w-4" />
  Change Photo
</div>

  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }}
  />
</label>
</div>

   <div className="card-luxury p-6 lg:col-span-2">
  <h2 className="mb-6 text-xl font-semibold text-charcoal-900">
    Personal Information
  </h2>

  <div className="grid gap-6 md:grid-cols-2">

    {/* Full Name */}
    <div>
      <label className="label-field">Full Name</label>
      <input
        className="input-field"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
    </div>

    {/* Email */}
    <div>
      <label className="label-field">Email Address</label>
      <input
        className="input-field bg-gray-100"
        value={profile?.email ?? ""}
        disabled
      />
    </div>

    {/* Phone */}
    <div>
      <label className="label-field">Phone Number</label>
      <input
        className="input-field"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
    </div>

    {/* Position */}
    <div>
      <label className="label-field">Position</label>
      <input
        className="input-field"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />
    </div>

    {/* Department */}
    <div>
      <label className="label-field">Department</label>
      <input
        className="input-field"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />
    </div>

    {/* Role */}
    <div>
      <label className="label-field">Role</label>
      <input
        className="input-field bg-gray-100 capitalize"
        value={(profile?.role ?? "").replace("_", " ")}
        disabled
      />
    </div>

  </div>
</div>

  </div>

 <div className="card-luxury p-6">
  <h2 className="mb-6 text-xl font-semibold text-charcoal-900">
    About Me
  </h2>

  <div className="space-y-6">

    {/* Address */}
    <div>
      <label className="label-field">Address</label>

      <textarea
        rows={3}
        className="input-field"
        placeholder="Enter your address..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
    </div>

    {/* Bio */}
    <div>
      <label className="label-field">Biography</label>

      <textarea
        rows={6}
        className="input-field"
        placeholder="Tell people about yourself..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
    </div>

  </div>
</div>

 <div className="card-luxury p-6">
  <h2 className="mb-6 text-xl font-semibold text-charcoal-900">
    Account Information
  </h2>

  <div className="space-y-5">

    <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
      <span className="text-charcoal-500">Role</span>

      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium capitalize text-emerald-700">
        {(profile?.role ?? "").replace("_", " ")}
      </span>
    </div>

    <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
      <span className="text-charcoal-500">Status</span>

      <span
        className={`rounded-full px-3 py-1 text-sm font-medium ${
          profile?.is_active
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {profile?.is_active ? "Active" : "Inactive"}
      </span>
    </div>

    <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
      <span className="text-charcoal-500">Member Since</span>

      <span className="font-medium text-charcoal-900">
        {profile?.created_at
          ? new Date(profile.created_at).toLocaleDateString()
          : "-"}
      </span>
    </div>

    <div className="flex items-center justify-between border-b border-ivory-200 pb-3">
      <span className="text-charcoal-500">Last Updated</span>

      <span className="font-medium text-charcoal-900">
        {profile?.updated_at
          ? new Date(profile.updated_at).toLocaleDateString()
          : "-"}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-charcoal-500">User ID</span>

      <span className="max-w-[220px] truncate text-sm text-charcoal-700">
        {profile?.id}
      </span>
    </div>

  </div>
</div>

  {/* Save Button */}
  <div className="flex justify-end">
    <button
      onClick={handleSave}
      disabled={saving}
      className="rounded-xl bg-emerald-700 px-6 py-3 font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save Changes"}
    </button>
  </div>
</div>
  );
}