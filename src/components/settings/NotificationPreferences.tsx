import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Clock, Users, AlertTriangle, MessageSquare } from "lucide-react";
import type { NotificationPreferences as NotificationPrefsType } from "@/types/settings";

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPrefsType>({
    alert_notifications: true,
    safe_circle_notifications: true,
    emergency_alerts: true,
    quiet_hours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    }
  });

  const handleToggle = (key: keyof Omit<NotificationPrefsType, 'quiet_hours'>) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleQuietHoursToggle = () => {
    setPreferences(prev => ({
      ...prev,
      quiet_hours: {
        ...prev.quiet_hours,
        enabled: !prev.quiet_hours.enabled
      }
    }));
  };

  const handleTimeChange = (field: 'start' | 'end', value: string) => {
    setPreferences(prev => ({
      ...prev,
      quiet_hours: {
        ...prev.quiet_hours,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Notification Preferences</h2>
      </div>

      <Alert>
        <Bell className="h-4 w-4" />
        <AlertDescription>
          Customize how and when you receive notifications about safety alerts, messages, and emergency situations.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alert Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alert-notifications">Safety Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for potential safety threats
                </p>
              </div>
              <Switch
                id="alert-notifications"
                checked={preferences.alert_notifications}
                onCheckedChange={() => handleToggle('alert_notifications')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Critical emergency notifications (always enabled for safety)
                </p>
              </div>
              <Switch
                id="emergency-alerts"
                checked={preferences.emergency_alerts}
                onCheckedChange={() => handleToggle('emergency_alerts')}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Safe Circle Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="safe-circle">Safe Circle Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications from your trusted contacts and safe circle
                </p>
              </div>
              <Switch
                id="safe-circle"
                checked={preferences.safe_circle_notifications}
                onCheckedChange={() => handleToggle('safe_circle_notifications')}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Quiet Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">
                Pause non-emergency notifications during specified hours
              </p>
            </div>
            <Switch
              id="quiet-hours"
              checked={preferences.quiet_hours.enabled}
              onCheckedChange={handleQuietHoursToggle}
            />
          </div>

          {preferences.quiet_hours.enabled && (
            <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={preferences.quiet_hours.start}
                  onChange={(e) => handleTimeChange('start', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={preferences.quiet_hours.end}
                  onChange={(e) => handleTimeChange('end', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Notification Customization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-alerts">Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Play sound for safety alerts
                </p>
              </div>
              <Switch id="sound-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="vibration">Vibration</Label>
                <p className="text-sm text-muted-foreground">
                  Vibrate device for notifications
                </p>
              </div>
              <Switch id="vibration" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="preview">Message Preview</Label>
                <p className="text-sm text-muted-foreground">
                  Show message content in notifications
                </p>
              </div>
              <Switch id="preview" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Notification Settings</Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
