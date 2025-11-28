import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Bell, Users, LogOut, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import ActivityTable from "@/components/ActivityTable";

import EmergencyButton from "@/components/EmergencyButton";
import AlertCard from "@/components/AlertCard";
import PlatformCard from "@/components/PlatformCard";

const Dashboard = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [protectionActive, setProtectionActive] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    setupRealtimeSubscription();
  }, []);

  // Fetch Alerts + Platforms from Supabase
  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: alertsData } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const { data: platformsData } = await supabase
        .from("platforms")
        .select("*")
        .eq("user_id", user.id);

      setAlerts(alertsData || []);
      setPlatforms(platformsData || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Dashboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Live updates when new alerts come in
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "alerts",
        },
        (payload) => {
          setAlerts((prev) => [payload.new, ...prev]);
          toast({
            title: "⚠ New Threat Detected",
            description: "A new alert has been detected.",
            variant: "destructive",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Block Alert
  const handleBlockAlert = async (alertId: string) => {
    try {
      await supabase.from("alerts").update({ status: "blocked" }).eq("id", alertId);

      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: "blocked" } : a))
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Ignore Alert
  const handleIgnoreAlert = async (alertId: string) => {
    try {
      await supabase.from("alerts").update({ status: "ignored" }).eq("id", alertId);

      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: "ignored" } : a))
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const newAlerts = alerts.filter((a) => a.status === "new").length;
  const activePlatforms = platforms.filter((p) => p.is_active).length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 lg:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/safe-circle")}>
              <Users className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="New Alerts" value={newAlerts} />
          <StatCard title="Connected Platforms" value={activePlatforms} />
          <StatCard title="Total Alerts" value={alerts.length} />
          <StatCard title="Protection Status" value={protectionActive ? "Active" : "Inactive"} />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Alerts */}
          <Card className="p-6 lg:col-span-2 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Alerts
              </h2>
              <Button variant="ghost" onClick={() => navigate("/alerts")}>
                View All
              </Button>
            </div>

            {alerts.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">
                No alerts yet — your digital shield is monitoring.
              </p>
            ) : (
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onBlock={handleBlockAlert}
                    onIgnore={handleIgnoreAlert}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Emergency Panel */}
          <Card className="p-6 border-destructive/30 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Emergency Protocol</h2>
            <EmergencyButton />
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/safe-circle")}
            >
              <Users className="w-4 h-4 mr-2" /> Manage Safe Circle
            </Button>
          </Card>
        </div>

        {/* ACTIVITY TABLE */}
        <div className="mt-10">
          <ActivityTable activities={alerts} />

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
