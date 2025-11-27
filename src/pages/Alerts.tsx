import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, Download, Filter } from "lucide-react";
import AlertCard from "@/components/AlertCard";
import { Badge } from "@/components/ui/badge";

const Alerts = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "new" | "blocked" | "ignored">("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading alerts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockAlert = async (alertId: string) => {
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

  const handleExport = () => {
    toast({
      title: "Export Coming Soon",
      description: "PDF export functionality will be available in production.",
    });
  };

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
              <h1 className="text-2xl font-bold">Alert History</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap flex-1">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("all")}
            >
              All
            </Badge>
            <Badge
              variant={filter === "new" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("new")}
            >
              New
            </Badge>
            <Badge
              variant={filter === "blocked" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("blocked")}
            >
              Blocked
            </Badge>
            <Badge
              variant={filter === "ignored" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("ignored")}
            >
              Ignored
            </Badge>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No alerts found.</p>
                <p className="text-sm mt-2">
                  {filter === "all"
                    ? "Your digital shield is monitoring."
                    : `No ${filter} alerts at the moment.`}
                </p>
              </div>
            </Card>
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
      </main>
    </div>
  );
};

export default Alerts;
