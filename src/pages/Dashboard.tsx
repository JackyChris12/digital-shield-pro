import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmergencyButton from "@/components/EmergencyButton";
<<<<<<< HEAD
import EmergencyStatus from "@/components/EmergencyStatus";
=======
>>>>>>> afe50fa8cfcf3786002e16c90dacd470dd52e28b
import AlertCard from "@/components/AlertCard";
import PlatformCard from "@/components/PlatformCard";
import { Shield, Activity, LogOut, Users, AlertTriangle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load alerts
      const { data: alertsData } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      // Load platforms
      const { data: platformsData } = await supabase
        .from("platforms")
        .select("*")
        .eq("user_id", user.id);

      setAlerts(alertsData || []);
      setPlatforms(platformsData || []);
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
          setAlerts((prev) => [payload.new, ...prev].slice(0, 5));
          toast({
            title: "New Threat Detected",
            description: "A new alert has been logged.",
            variant: "destructive",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSignOut = async () => {
    // Mock sign out for demo
    navigate("/auth");
  };

  const handleBlockAlert = async (alertId: string) => {
    // Mock block alert for demo
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "blocked" } : alert
      )
    );

    toast({
      title: "Alert Blocked",
      description: "The sender has been blocked.",
    });
  };

  const handleIgnoreAlert = async (alertId: string) => {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Aegis
              </h1>
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> afe50fa8cfcf3786002e16c90dacd470dd52e28b
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/safe-circle")}
              >
                <Users className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/settings")}
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

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
                {["twitter", "instagram", "whatsapp"].map((platformName) => {
                  const platform = platforms.find((p) => p.platform_name === platformName);
                  return (
                    <PlatformCard
                      key={platformName}
                      platform={platform}
                      platformName={platformName}
                      onConnect={() => {
                        toast({
                          title: "Coming Soon",
                          description: `${platformName} integration will be available in production.`,
                        });
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
                  onClick={() => navigate("/alerts")}
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
<<<<<<< HEAD
            <EmergencyStatus />

=======
>>>>>>> afe50fa8cfcf3786002e16c90dacd470dd52e28b
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
