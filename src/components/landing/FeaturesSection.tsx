import { Shield, CheckCircle, AlertTriangle, Lock, Zap, Globe } from "lucide-react";

const features = [
    {
        icon: <Shield className="w-6 h-6 text-primary" />,
        title: "Real-time Protection",
        description: "AI-powered threat detection across all your connected social platforms instantly.",
        color: "bg-primary/20"
    },
    {
        icon: <Globe className="w-6 h-6 text-blue-500" />,
        title: "Multi-Platform Support",
        description: "Seamlessly monitor Twitter, Instagram, TikTok and more from a single unified dashboard.",
        color: "bg-blue-500/20"
    },
    {
        icon: <AlertTriangle className="w-6 h-6 text-warning" />,
        title: "Emergency Protocol",
        description: "One-touch SOS alerts to your trusted contacts with your live location and status.",
        color: "bg-warning/20"
    },
    {
        icon: <Lock className="w-6 h-6 text-accent" />,
        title: "Evidence Vault",
        description: "Secure, tamper-proof logging of all threats and harassment for legal documentation.",
        color: "bg-accent/20"
    },
    {
        icon: <Zap className="w-6 h-6 text-yellow-400" />,
        title: "Instant Blocking",
        description: "Automatically block malicious accounts across platforms before they can reach you.",
        color: "bg-yellow-400/20"
    },
    {
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        title: "Verified Safety",
        description: "Get a verified safety score and actionable insights to improve your digital hygiene.",
        color: "bg-green-500/20"
    }
];

export const FeaturesSection = () => {
    return (
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Comprehensive Digital Protection
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        We combine advanced AI with intuitive design to keep you safe online without compromising your experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
