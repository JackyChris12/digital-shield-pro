import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialMediaSafety from "@/components/settings/SocialMediaSafety";
import EmergencyProtocols from "@/components/settings/EmergencyProtocols";
import PrivacyControls from "@/components/settings/PrivacyControls";
import ProfileManagement from "@/components/settings/ProfileManagement";
import NotificationPreferences from "@/components/settings/NotificationPreferences";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="social-media" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="social-media">Social Media Safety</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Protocols</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="social-media" className="mt-6">
            <SocialMediaSafety />
          </TabsContent>
          <TabsContent value="emergency" className="mt-6">
            <EmergencyProtocols />
          </TabsContent>
          <TabsContent value="privacy" className="mt-6">
            <PrivacyControls />
          </TabsContent>
          <TabsContent value="profile" className="mt-6">
            <ProfileManagement />
          </TabsContent>
          <TabsContent value="notifications" className="mt-6">
            <NotificationPreferences />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
