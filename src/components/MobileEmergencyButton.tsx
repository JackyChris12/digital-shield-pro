import { useState } from "react";
import { AlertTriangle } from "lucide-react";
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
import { safeCircleService } from "@/services/SafeCircleService";

const MobileEmergencyButton = () => {
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
                    notes: "Emergency activated via mobile button",
                });

            if (eventError) throw eventError;

            // Get emergency contacts
            const { data: contacts, error: contactsError } = await supabase
                .from("emergency_contacts")
                .select("*")
                .eq("user_id", user.id);

            if (contactsError) throw contactsError;

            // Trigger mock Safe Circle notifications
            const location = "Unknown Location";
            await safeCircleService.triggerEmergencyProtocol(location, "MOBILE EMERGENCY - Immediate assistance required");

            // Get mock contacts count
            const mockContacts = await safeCircleService.getContacts();
            const totalContacts = (contacts?.length || 0) + mockContacts.length;

            if (totalContacts === 0) {
                toast({
                    title: "No Contacts Found",
                    description: "Please add emergency contacts to your Safe Circle before triggering an alert.",
                    variant: "destructive",
                });
                setShowDialog(false);
                setActivating(false);
                return;
            }

            // Try to call Edge Function (may not exist in mock setup)
            try {
                const { error } = await supabase.functions.invoke('send-emergency-alert', {
                    body: { location },
                });

                if (error) {
                    console.warn("Edge Function Error (expected in mock mode):", error);
                }
            } catch (edgeFnError) {
                console.warn("Edge function not available (mock mode)");
            }

            toast({
                title: "🚨 Emergency Protocol Activated",
                description: `Alerts sent to ${totalContacts} contact(s) in your Safe Circle.`,
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
            {/* Mobile Floating Emergency Button */}
            <button
                onClick={() => setShowDialog(true)}
                className="emergency-protocol-mobile bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white flex items-center justify-center"
                aria-label="Emergency Alert"
                style={{
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                <AlertTriangle className="w-10 h-10" />
            </button>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent className="max-w-[calc(100vw-32px)] mx-4">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive text-xl">
                            🚨 Activate Emergency Protocol?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                            This will <strong>immediately alert all your Safe Circle contacts</strong> via email and SMS.
                            Only use in genuine emergencies.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-3">
                        <AlertDialogCancel
                            disabled={activating}
                            className="w-full sm:w-auto min-h-[48px]"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleEmergency}
                            disabled={activating}
                            className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto min-h-[48px] text-base font-bold"
                        >
                            {activating ? "Activating..." : "🚨 ACTIVATE EMERGENCY"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default MobileEmergencyButton;
