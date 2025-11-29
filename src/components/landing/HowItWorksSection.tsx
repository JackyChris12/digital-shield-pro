import { UserPlus, LayoutDashboard, ShieldCheck } from "lucide-react";

const steps = [
    {
        icon: <UserPlus className="w-8 h-8 text-primary" />,
        title: "1. Connect Accounts",
        description: "Securely link your social media profiles. We use official APIs and never store your passwords."
    },
    {
        icon: <LayoutDashboard className="w-8 h-8 text-accent" />,
        title: "2. Activate Monitoring",
        description: "Our AI immediately starts scanning for harassment, threats, and malicious behavior."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
        title: "3. Stay Protected",
        description: "Receive instant alerts and take action with one click. Your digital safety is now automated."
    }
];

export const HowItWorksSection = () => {
    return (
        <section className="py-24 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">How Aegis Works</h2>
                    <p className="text-muted-foreground">
                        Simple setup, powerful protection. Get started in less than 2 minutes.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
                    {/* Connector Line (Desktop only) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-background border-4 border-secondary flex items-center justify-center mb-6 shadow-lg z-10">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground max-w-xs">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
