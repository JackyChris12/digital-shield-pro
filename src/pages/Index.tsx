import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, AlertTriangle, Users, Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Aegis
          </h1>
          
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
            Your universal digital shield against online harassment
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Get Protected Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
          <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Protection</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered threat detection across all your platforms
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Multi-Platform</h3>
            <p className="text-sm text-muted-foreground">
              Monitor Twitter, Instagram, and more from one dashboard
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <h3 className="font-semibold mb-2">Emergency Protocol</h3>
            <p className="text-sm text-muted-foreground">
              One-touch alerts to your trusted contacts
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Evidence Vault</h3>
            <p className="text-sm text-muted-foreground">
              Secure logging and export for legal documentation
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <h2 className="text-3xl font-bold mb-4">Ready to feel safer online?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of women who trust Aegis to protect their digital presence.
            Start monitoring your platforms in minutes.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-12"
          >
            Start Free Protection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
