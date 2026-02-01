import { notFound } from "next/navigation";
import { ProfileView } from "@/components/profile-view";
import { getCurrentUserId } from "@/app/actions/auth";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const currentUserId = await getCurrentUserId();

  return (
    <ProfileView
      userId={userId}
      isOwnProfile={currentUserId === userId}
    />
  );
}
