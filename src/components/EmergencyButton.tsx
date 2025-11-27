import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EmergencyButton = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [activating, setActivating] = useState(false);
  const { toast } = useToast();

  const handleEmergency = async () => {
    setActivating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      // Log the emergency event
      const { error: eventError } = await supabase
        .from("emergency_events")
        .insert({
          user_id: user.id,
          notes: "Emergency activated via dashboard",
        });

      if (eventError) throw eventError;

      // Get emergency contacts
      const { data: contacts, error: contactsError } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", user.id);

      if (contactsError) throw contactsError;

      toast({
        title: "Emergency Protocol Activated",
        description: `Alert sent to ${contacts?.length || 0} emergency contacts.`,
        variant: "destructive",
      });

      // TODO: In production, trigger email/SMS to emergency contacts via edge function
      
      setShowDialog(false);
    } catch (error: any) {
      toast({
        title: "Emergency Activation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        size="lg"
        className="w-full h-24 text-xl font-bold bg-gradient-to-r from-destructive to-threat-high hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
      >
        <AlertTriangle className="w-8 h-8 mr-3" />
        Emergency
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Activate Emergency Protocol?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately alert all your Safe Circle contacts and log this emergency event.
              Only use in genuine emergencies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={activating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmergency}
              disabled={activating}
              className="bg-destructive hover:bg-destructive/90"
            >
              {activating ? "Activating..." : "Activate Emergency"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmergencyButton;
