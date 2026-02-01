import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/app/actions/auth";
import { ProfileView } from "@/components/profile-view";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/");

  return <ProfileView userId={userId} isOwnProfile />;
}
