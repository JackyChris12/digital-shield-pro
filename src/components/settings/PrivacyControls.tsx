import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Download, MapPin, Database, AlertTriangle } from "lucide-react";
import type { PrivacySettings } from "@/types/settings";

const PrivacyControls = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    data_sharing: false,
    location_sharing: false,
    emergency_data_access: true,
    data_export_enabled: true,
  });

  const handleToggle = (key: keyof PrivacySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDataExport = () => {
    // Mock data export functionality
    alert("Data export initiated. You will receive an email with your data shortly.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Privacy & Security Controls</h2>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Control how your data is used and shared. We prioritize your privacy and security.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-sharing">Allow Data Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Share anonymized data to improve safety features
                </p>
              </div>
              <Switch
                id="data-sharing"
                checked={settings.data_sharing}
                onCheckedChange={() => handleToggle('data_sharing')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emergency-access">Emergency Data Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow emergency services to access your location and contacts
                </p>
              </div>
              <Switch
                id="emergency-access"
                checked={settings.emergency_data_access}
                onCheckedChange={() => handleToggle('emergency_data_access')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location-sharing">Location Sharing</Label>
                <p className="text-sm text-muted-foreground">
                  Share your location with trusted contacts during emergencies
                </p>
              </div>
              <Switch
                id="location-sharing"
                checked={settings.location_sharing}
                onCheckedChange={() => handleToggle('location_sharing')}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-export">Enable Data Export</Label>
              <p className="text-sm text-muted-foreground">
                Allow downloading your personal data
              </p>
            </div>
            <Switch
              id="data-export"
              checked={settings.data_export_enabled}
              onCheckedChange={() => handleToggle('data_export_enabled')}
            />
          </div>

          {settings.data_export_enabled && (
            <div className="pt-4 border-t">
              <Button onClick={handleDataExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Your data will be exported in JSON format and sent to your email.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Changes to privacy settings may take a few minutes to take effect across all platforms.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button>Save Privacy Settings</Button>
      </div>
    </div>
  );
};

export default PrivacyControls;
