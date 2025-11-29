import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Phone, MessageSquare, Users, Settings } from "lucide-react";
import type { EmergencyProtocols as EmergencyProtocolType, BackupPlan } from "@/types/settings";

const EmergencyProtocols = () => {
  const [protocols, setProtocols] = useState<EmergencyProtocolType>({
    emergency_button_customization: {
      label: "EMERGENCY",
      color: "red"
    },
    auto_alert_triggers: ["high_threat", "location_change"],
    safe_circle_escalation: true,
    backup_safety_plans: [
      { id: "1", name: "Call Emergency Services", description: "Automatically call 911", enabled: true },
      { id: "2", name: "Notify Safe Circle", description: "Alert trusted contacts", enabled: true },
      { id: "3", name: "Location Sharing", description: "Share real-time location", enabled: false },
    ]
  });

  const handleBackupPlanToggle = (id: string) => {
    setProtocols(prev => ({
      ...prev,
      backup_safety_plans: prev.backup_safety_plans.map(plan =>
        plan.id === id ? { ...plan, enabled: !plan.enabled } : plan
      )
    }));
  };

  const handleTriggerToggle = (trigger: string) => {
    setProtocols(prev => ({
      ...prev,
      auto_alert_triggers: prev.auto_alert_triggers.includes(trigger)
        ? prev.auto_alert_triggers.filter(t => t !== trigger)
        : [...prev.auto_alert_triggers, trigger]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <h2 className="text-2xl font-bold">Emergency Protocols</h2>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Configure your emergency response settings. These will activate when you trigger the emergency button or when auto-alert conditions are met.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Emergency Button Customization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="button-label">Button Label</Label>
              <Input
                id="button-label"
                value={protocols.emergency_button_customization.label}
                onChange={(e) => setProtocols(prev => ({
                  ...prev,
                  emergency_button_customization: {
                    ...prev.emergency_button_customization,
                    label: e.target.value
                  }
                }))}
                placeholder="EMERGENCY"
              />
            </div>
            <div>
              <Label htmlFor="button-color">Button Color</Label>
              <Select
                value={protocols.emergency_button_customization.color}
                onValueChange={(value) => setProtocols(prev => ({
                  ...prev,
                  emergency_button_customization: {
                    ...prev.emergency_button_customization,
                    color: value
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Auto-Alert Triggers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-threat">High Threat Messages</Label>
                <Switch
                  id="high-threat"
                  checked={protocols.auto_alert_triggers.includes("high_threat")}
                  onCheckedChange={() => handleTriggerToggle("high_threat")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="location-change">Sudden Location Change</Label>
                <Switch
                  id="location-change"
                  checked={protocols.auto_alert_triggers.includes("location_change")}
                  onCheckedChange={() => handleTriggerToggle("location_change")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="multiple-reports">Multiple Reports</Label>
                <Switch
                  id="multiple-reports"
                  checked={protocols.auto_alert_triggers.includes("multiple_reports")}
                  onCheckedChange={() => handleTriggerToggle("multiple_reports")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="time-sensitive">Time-Sensitive Threats</Label>
                <Switch
                  id="time-sensitive"
                  checked={protocols.auto_alert_triggers.includes("time_sensitive")}
                  onCheckedChange={() => handleTriggerToggle("time_sensitive")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Safe Circle Escalation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Safe Circle Escalation</p>
              <p className="text-sm text-muted-foreground">
                Automatically notify your safe circle contacts when emergency protocols are triggered
              </p>
            </div>
            <Switch
              checked={protocols.safe_circle_escalation}
              onCheckedChange={(checked) => setProtocols(prev => ({
                ...prev,
                safe_circle_escalation: checked
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Backup Safety Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {protocols.backup_safety_plans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{plan.name}</h4>
                    {plan.enabled && <Badge variant="secondary">Active</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <Switch
                  checked={plan.enabled}
                  onCheckedChange={() => handleBackupPlanToggle(plan.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Emergency Settings</Button>
      </div>
    </div>
  );
};

export default EmergencyProtocols;
