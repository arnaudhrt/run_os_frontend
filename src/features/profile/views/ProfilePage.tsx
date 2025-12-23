import { useAuthStore } from "@/features/auth/stores/auth.store";
import ServicesSection from "../components/ServicesSection";
import DangerSection from "../components/DangerSection";
import UserInfoSection from "../components/UserInfoSection";
import LoaderScreen from "@/lib/components/LoaderScreen";

export default function ProfilePage() {
  const { dbUser } = useAuthStore();

  if (!dbUser) {
    return <LoaderScreen />;
  }

  const stravaConnection = dbUser.strava_account?.id ? true : false;
  const garminConnection = dbUser.garmin_account?.id ? true : false;

  return (
    <section className="flex-1 px-8 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your account settings and connected services.</p>
        </div>

        <UserInfoSection user={dbUser} />
        <ServicesSection stravaConnection={stravaConnection} garminConnection={garminConnection} />
        <DangerSection />
      </div>
    </section>
  );
}
