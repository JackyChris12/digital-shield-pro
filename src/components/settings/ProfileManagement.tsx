import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { User, Phone, Mail, Globe, Eye, ShieldCheck } from "lucide-react";
import type { UserProfile, EmergencyContact, SafetyPreferences } from "@/types/settings";

const ProfileManagement = () => {
  const [profile, setProfile] = useState<UserProfile>({
    id: "1",
    full_name: "Jane Doe",
    username: "janedoe",
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop",
    email: "jane@example.com",
    emergency_contacts: [
      { id: "1", name: "John Doe", phone: "+1-555-0123", email: "john@example.com", is_primary: true },
      { id: "2", name: "Sarah Smith", phone: "+1-555-0456", email: null, is_primary: false },
    ],
    safety_preferences: {
      language: "en",
      accessibility: true,
      theme: "system",
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSafetyPrefChange = (key: keyof SafetyPreferences, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      safety_preferences: { ...prev.safety_preferences, [key]: value }
    }));
  };

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: "",
      phone: null,
      email: null,
      is_primary: false,
    };
    setProfile(prev => ({
      ...prev,
      emergency_contacts: [...prev.emergency_contacts, newContact]
    }));
  };

  const updateEmergencyContact = (id: string, field: keyof EmergencyContact, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const setPrimaryContact = (id: string) => {
    setProfile(prev => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts.map(contact => ({
        ...contact,
        is_primary: contact.id === id
      }))
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold">Profile Management</h2>
      </div>

      <Alert>
        <User className="h-4 w-4" />
        <AlertDescription>
          Manage your personal information and safety preferences. Keep your details up to date for better protection.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              <AvatarFallback>{profile.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Change Avatar
              </Button>
              <p className="text-sm text-muted-foreground">Upload a profile picture for better identification</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                name="full_name"
                value={profile.full_name || ""}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={profile.username || ""}
                onChange={handleInputChange}
                placeholder="Enter username"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email || ""}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">Add trusted contacts for emergency situations</p>
            <Button variant="outline" size="sm" onClick={addEmergencyContact}>
              Add Contact
            </Button>
          </div>
          <div className="space-y-3">
            {profile.emergency_contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Input
                      value={contact.name}
                      onChange={(e) => updateEmergencyContact(contact.id, 'name', e.target.value)}
                      placeholder="Contact name"
                      className="flex-1"
                    />
                    {contact.is_primary && <Badge variant="secondary">Primary</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={contact.phone || ""}
                      onChange={(e) => updateEmergencyContact(contact.id, 'phone', e.target.value)}
                      placeholder="Phone number"
                      className="flex-1"
                    />
                    <Input
                      value={contact.email || ""}
                      onChange={(e) => updateEmergencyContact(contact.id, 'email', e.target.value)}
                      placeholder="Email"
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPrimaryContact(contact.id)}
                  disabled={contact.is_primary}
                >
                  {contact.is_primary ? "Primary" : "Set Primary"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Safety Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              value={profile.safety_preferences.language}
              onChange={(e) => handleSafetyPrefChange('language', e.target.value)}
              placeholder="en"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="accessibility">Accessibility Features</Label>
              <p className="text-sm text-muted-foreground">Enable high contrast, larger text, etc.</p>
            </div>
            <Switch
              checked={profile.safety_preferences.accessibility}
              onCheckedChange={(checked) => handleSafetyPrefChange('accessibility', checked)}
            />
          </div>
          <div>
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              value={profile.safety_preferences.theme}
              onChange={(e) => handleSafetyPrefChange('theme', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Profile</Button>
      </div>
    </div>
  );
};

export default ProfileManagement;
