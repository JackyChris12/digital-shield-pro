import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        name: "Sarah J.",
        role: "Digital Creator",
        content: "Aegis has completely changed how I manage my online presence. I feel safe creating content again.",
        avatar: "SJ"
    },
    {
        name: "Dr. Emily R.",
        role: "Journalist",
        content: "The evidence vault is a game-changer for documenting harassment. Essential tool for public figures.",
        avatar: "ER"
    },
    {
        name: "Michelle K.",
        role: "Activist",
        content: "Finally, a platform that takes digital safety seriously. The emergency protocol gives me real peace of mind.",
        avatar: "MK"
    }
];

export const TrustSection = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Trusted by Digital Leaders</h2>
                    <p className="text-muted-foreground">
                        Join thousands of users who rely on Aegis for their digital safety.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="p-6 rounded-2xl bg-secondary/20 border border-border/50">
                            <p className="text-lg mb-6 italic text-muted-foreground">"{testimonial.content}"</p>
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                        {testimonial.avatar}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold">{testimonial.name}</div>
                                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
