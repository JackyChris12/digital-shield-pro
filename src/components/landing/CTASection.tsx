import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Ready to Reclaim Your Digital Space?
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Join the community of users who are taking a stand against online harassment.
                        Start your free 14-day trial today.
                    </p>

                    <div className="pt-4">
                        <Button
                            size="lg"
                            onClick={() => navigate("/auth")}
                            className="text-lg px-10 h-14 rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105"
                        >
                            Start Free Protection
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <p className="mt-4 text-sm text-muted-foreground">
                            No credit card required for trial • Cancel anytime
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
