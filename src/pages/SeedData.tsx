import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";

const SeedData = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const seedContacts = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to seed data.");

      const contacts = [
        {
          user_id: user.id,
          name: "Mom",
          phone: "+15550101",
          email: "mom@example.com",
          is_primary: true,
        },
        {
          user_id: user.id,
          name: "Dad",
          phone: "+15550102",
          email: "dad@example.com",
          is_primary: false,
        },
        {
          user_id: user.id,
          name: "Best Friend",
          phone: "+15550103",
          email: "bestie@example.com",
          is_primary: false,
        },
      ];

      const { error } = await supabase
        .from("emergency_contacts")
        .insert(contacts);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Added 3 example contacts to your Safe Circle.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearContacts = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("emergency_contacts")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Cleared",
        description: "All emergency contacts removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-md">
      <Card className="p-6 space-y-6">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-2">Seed Test Data</h1>
          <p className="text-muted-foreground">
            Quickly populate your Safe Circle with example contacts for testing.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={seedContacts} 
            disabled={loading} 
            className="w-full"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Add Example Contacts
          </Button>

          <Button 
            onClick={clearContacts} 
            disabled={loading} 
            variant="destructive" 
            className="w-full"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Clear All Contacts
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SeedData;
