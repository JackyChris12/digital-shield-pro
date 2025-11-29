import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus, Trash2, Shield, Phone, Mail, User, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { safeCircleService, SafeCircleContact } from "@/services/SafeCircleService";
import NotificationHistory from "@/components/NotificationHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmergencyContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  is_primary: boolean;
}

const SafeCircle = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [mockContacts, setMockContacts] = useState<SafeCircleContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mockDialogOpen, setMockDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [mockFormData, setMockFormData] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "friend" as 'family' | 'friend' | 'colleague' | 'emergency_contact',
    notificationPreference: "all_alerts" as 'all_alerts' | 'critical_only' | 'emergency_only'
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);

      // Load mock contacts
      const mockData = await safeCircleService.getContacts();
      setMockContacts(mockData);
    } catch (error: any) {
      toast({
        title: "Error loading contacts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("emergency_contacts").insert({
        user_id: user.id,
        name: formData.name,
        phone: formData.phone || null,
        email: formData.email || null,
      });

      if (error) throw error;

      toast({
        title: "Contact Added",
        description: "Emergency contact has been added to your Safe Circle.",
      });

      setFormData({ name: "", phone: "", email: "" });
      setDialogOpen(false);
      loadContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddMockContact = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await safeCircleService.addContact({
        name: mockFormData.name,
        email: mockFormData.email,
        phone: mockFormData.phone,
        relationship: mockFormData.relationship,
        notificationPreference: mockFormData.notificationPreference,
        isVerified: true
      });

      toast({
        title: "Mock Contact Added",
        description: "Demo contact has been added to your Safe Circle for testing.",
      });

      setMockFormData({
        name: "",
        phone: "",
        email: "",
        relationship: "friend",
        notificationPreference: "all_alerts"
      });
      setMockDialogOpen(false);
      loadContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from("emergency_contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Contact Removed",
        description: "Emergency contact has been removed from your Safe Circle.",
      });

      loadContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMockContact = async (id: string) => {
    try {
      await safeCircleService.removeContact(id);

      toast({
        title: "Mock Contact Removed",
        description: "Demo contact has been removed from your Safe Circle.",
      });

      loadContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-4xl md:px-6 sm:px-4">
        <Card className="p-6 md:p-4 mb-6 md:mb-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <h2 className="font-semibold mb-2 text-lg md:text-base">Your Safe Circle</h2>
          <p className="text-sm text-muted-foreground">
            These trusted contacts will be notified immediately when you activate the emergency protocol.
            Add people you trust who can help in critical situations.
          </p>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-4 gap-3">
          <h2 className="text-xl md:text-lg font-semibold">
            Emergency Contacts ({contacts.length + mockContacts.length})
          </h2>
          <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
            <Dialog open={mockDialogOpen} onOpenChange={setMockDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto min-h-[44px]">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Demo Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Demo Contact</DialogTitle>
                  <DialogDescription>
                    Add a mock contact for testing notifications and Safe Circle functionality.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMockContact} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mock-name">Name *</Label>
                    <Input
                      id="mock-name"
                      placeholder="Full name"
                      value={mockFormData.name}
                      onChange={(e) => setMockFormData({ ...mockFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mock-phone">Phone Number</Label>
                    <Input
                      id="mock-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={mockFormData.phone}
                      onChange={(e) => setMockFormData({ ...mockFormData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mock-email">Email *</Label>
                    <Input
                      id="mock-email"
                      type="email"
                      placeholder="email@example.com"
                      value={mockFormData.email}
                      onChange={(e) => setMockFormData({ ...mockFormData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Select
                      value={mockFormData.relationship}
                      onValueChange={(value: any) => setMockFormData({ ...mockFormData, relationship: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="colleague">Colleague</SelectItem>
                        <SelectItem value="emergency_contact">Emergency Contact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-pref">Notification Preference</Label>
                    <Select
                      value={mockFormData.notificationPreference}
                      onValueChange={(value: any) => setMockFormData({ ...mockFormData, notificationPreference: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_alerts">All Alerts</SelectItem>
                        <SelectItem value="critical_only">Critical Only</SelectItem>
                        <SelectItem value="emergency_only">Emergency Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    Add Demo Contact
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto min-h-[44px]">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                  <DialogDescription>
                    Add a trusted person to your Safe Circle. They will be notified during emergencies.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddContact} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Add Contact
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 mb-6">
          {contacts.length === 0 && mockContacts.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No emergency contacts yet.</p>
                <p className="text-sm mt-2">Add trusted contacts to complete your Safe Circle.</p>
              </div>
            </Card>
          ) : (
            <>
              {contacts.map((contact) => (
                <Card key={contact.id} className="p-4 md:p-3 hover:bg-card/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{contact.name}</h3>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {contact.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px] min-w-[44px]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}

              {mockContacts.map((contact) => (
                <Card key={contact.id} className="p-4 md:p-3 hover:bg-card/50 transition-colors border-primary/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{contact.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">Demo</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">{contact.relationship}</span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {contact.email}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Bell className="w-4 h-4" />
                          <span className="text-xs">
                            {contact.notificationPreference === 'all_alerts' && 'All Alerts'}
                            {contact.notificationPreference === 'critical_only' && 'Critical Only'}
                            {contact.notificationPreference === 'emergency_only' && 'Emergency Only'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMockContact(contact.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px] min-w-[44px]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>

        <NotificationHistory />
      </main>
    </div>
  );
};

export default SafeCircle;
