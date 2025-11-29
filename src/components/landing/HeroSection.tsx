import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center justify-center p-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
                            <span className="px-3 py-1 text-sm font-medium text-primary flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                #1 Digital Safety Platform
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold tracking-tight animate-fade-in">
                            Your Digital Life, <br />
                            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                                Uncompromised
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in delay-200">
                            Advanced AI protection against online harassment, threats, and digital violence.
                            Reclaim your peace of mind today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-8 animate-fade-in delay-300">
                            <Button
                                size="lg"
                                onClick={() => navigate("/auth")}
                                className="text-lg px-8 h-14 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                            >
                                Get Protected Now
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate("/auth")}
                                className="text-lg px-8 h-14 rounded-full border-2 hover:bg-secondary/50"
                            >
                                View Demo
                            </Button>
                        </div>

                        {/* Stats/Trust Indicators */}
                        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border/50 mt-12 animate-fade-in delay-500">
                            <div>
                                <div className="text-3xl font-bold text-primary">24/7</div>
                                <div className="text-sm text-muted-foreground">Active Monitoring</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary">99%</div>
                                <div className="text-sm text-muted-foreground">Threat Detection</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary">0s</div>
                                <div className="text-sm text-muted-foreground">Data Latency</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary">10k+</div>
                                <div className="text-sm text-muted-foreground">Protected Users</div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="hidden lg:block relative animate-fade-in delay-500">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl -z-10" />
                        <img
                            src="/hero-shield.png"
                            alt="Digital Shield Protection"
                            className="w-full h-auto drop-shadow-2xl animate-float hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
