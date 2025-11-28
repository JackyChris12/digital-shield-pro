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

      const location = "Unknown Location";

      // Call Edge Function
      const { data, error } = await supabase.functions.invoke('send-emergency-alert', {
        body: { location },
      });

      if (error) {
        console.error("Edge Function Error:", error);
        throw new Error("Failed to send alerts. Please ensure the Edge Function is deployed.");
      }

      toast({
        title: "Emergency Protocol Activated",
        description: `Email alerts sent to your Safe Circle contacts.`,
        variant: "destructive",
      });

      setShowDialog(false);
    } catch (error: any) {
      console.error("Emergency Error:", error);
      toast({
        title: "Emergency Activation Failed",
        description: error.message || "Please check console for details",
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
              This will send email alerts to all your Safe Circle contacts.
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
              {activating ? "Sending Alerts..." : "Activate Emergency"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmergencyButton;
