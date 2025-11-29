import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmergencyButton from "@/components/EmergencyButton";
import EmergencyStatus from "@/components/EmergencyStatus";
import AlertCard from "@/components/AlertCard";
import PlatformCard from "@/components/PlatformCard";
import { Shield, Activity, LogOut, Users, AlertTriangle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { mockSocialService } from "@/services/MockSocialService";
import { alertService } from "@/services/AlertService";

const Dashboard = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [protectionActive, setProtectionActive] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    const unsubscribe = setupRealtimeSubscription();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load alerts from Supabase
      const { data: alertsData } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      // Load platforms from Supabase
      const { data: platformsData } = await supabase
        .from("platforms")
        .select("*")
        .eq("user_id", user.id);

      // Merge mock alerts with Supabase alerts
      const mockAlerts = alertService.getAlerts();
      // Combine and sort by date descending
      const allAlerts = [...(alertsData || []), ...mockAlerts]
        .sort((a: any, b: any) => new Date(b.created_at || b.timestamp).getTime() - new Date(a.created_at || a.timestamp).getTime())
        .slice(0, 5);

      setAlerts(allAlerts);

      // Merge Supabase data with Mock Service status
      const mergedPlatforms = platformsData || [];

      // Check mock service for any connected platforms not in DB or to override
      ['twitter', 'instagram', 'tiktok'].forEach(p => {
        if (mockSocialService.isConnected(p)) {
          const existing = mergedPlatforms.find((mp: any) => mp.platform_name === p);
          if (existing) {
            existing.is_active = true;
          } else {
            mergedPlatforms.push({
              id: `mock-${p}`,
              platform_name: p,
              is_active: true,
              user_id: user.id,
              access_token: '',
              refresh_token: '',
              created_at: new Date().toISOString(),
              last_sync_at: new Date().toISOString()
            });
          }
        }
      });

      setPlatforms(mergedPlatforms);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    // Initial load of mock alerts
    const currentAlerts = alertService.getAlerts();
    if (currentAlerts.length > 0) {
      // We don't want to overwrite Supabase alerts completely, but for this demo we prioritize mock alerts
      // Ideally we'd merge them here too, but for simplicity let's just show mock alerts if they exist
      // setAlerts(currentAlerts.slice(0, 5));
    }

    // Subscribe to new alerts
    const unsubscribe = alertService.subscribe((updatedAlerts) => {
      setAlerts(updatedAlerts.slice(0, 5));

      // Check if the latest alert is new (to show toast)
      const latest = updatedAlerts[0];
      if (latest && latest.timestamp.getTime() > Date.now() - 1000) {
        // Toast is already handled in MockSocialService
      }
    });

    return unsubscribe;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleBlockAlert = async (alertId: string) => {
    // Handle mock alerts
    if (alertId.startsWith('alert_')) {
      alertService.updateAlert(alertId, 'resolved');
      toast({
        title: "Alert Resolved",
        description: "The alert has been marked as resolved.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("alerts")
        .update({ status: "blocked" })
        .eq("id", alertId);

      if (error) throw error;

      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status: "blocked" } : alert
        )
      );

      toast({
        title: "Alert Blocked",
        description: "The sender has been blocked.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleIgnoreAlert = async (alertId: string) => {
    // Handle mock alerts
    if (alertId.startsWith('alert_')) {
      alertService.updateAlert(alertId, 'reviewed');
      toast({
        title: "Alert Reviewed",
        description: "The alert has been marked as reviewed.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("alerts")
        .update({ status: "ignored" })
        .eq("id", alertId);

      if (error) throw error;

      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status: "ignored" } : alert
        )
      );

      toast({
        title: "Alert Ignored",
        description: "This alert has been marked as ignored.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const activePlatforms = platforms.filter((p) => p.is_active).length;
  const newAlerts = alerts.filter((a) => a.status === "new").length;

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Protection Status */}
            <Card className="p-6 border-primary/30 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Protection Status
                </h2>
                <Badge
                  className={protectionActive ? "bg-success/20 text-success border-success/30" : "bg-muted"}
                >
                  {protectionActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Platforms Connected</p>
                  <p className="text-2xl font-bold text-primary">{activePlatforms}/3</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-destructive">{newAlerts}</p>
                </div>
              </div>
            </Card>

            {/* Connected Platforms */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Connected Platforms
              </h2>
              <div className="grid gap-4">
                {["twitter", "instagram", "tiktok"].map((platformName) => {
                  const platform = platforms.find((p) => p.platform_name === platformName);
                  const isConnected = platform?.is_active || mockSocialService.isConnected(platformName);

                  // Create a display platform object if one doesn't exist in DB
                  const displayPlatform = platform || {
                    id: `mock-${platformName}`,
                    platform_name: platformName,
                    is_active: isConnected
                  };

                  return (
                    <PlatformCard
                      key={platformName}
                      platform={displayPlatform}
                      platformName={platformName}
                      onConnect={() => {
                        navigate("/social-monitoring");
                      }}
                    />
                  );
                })}
              </div>
            </Card>

            {/* Recent Alerts */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Recent Alerts
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/alerts-history")}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No alerts yet. Your digital shield is monitoring.
                  </p>
                ) : (
                  alerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onBlock={handleBlockAlert}
                      onIgnore={handleIgnoreAlert}
                    />
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Emergency */}
          <div className="space-y-6">
            <EmergencyStatus />

            <Card className="p-6 border-destructive/30">
              <h2 className="text-xl font-semibold mb-4">Emergency Protocol</h2>
              <p className="text-sm text-muted-foreground mb-6">
                In case of immediate threat, activate emergency mode to alert your Safe Circle.
              </p>
              <EmergencyButton />
              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={() => navigate("/safe-circle")}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Safe Circle
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <h3 className="font-semibold mb-2">Protection Tips</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Connect all your social platforms for comprehensive protection</li>
                <li>• Update your Safe Circle contacts regularly</li>
                <li>• Review and act on alerts promptly</li>
                <li>• Export evidence logs for documentation</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
