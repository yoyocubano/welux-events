import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function Team() {
    const { t } = useTranslation();

    const team = [
        {
            id: 1,
            name: t("about.team_members.joan.name"),
            role: t("about.team_members.joan.role"),
            bio: t("about.team_members.joan.bio"),
            imageUrl: "/images/team/joan-v2.webp"
        },
        {
            id: 2,
            name: t("about.team_members.abel.name"),
            role: t("about.team_members.abel.role"),
            bio: t("about.team_members.abel.bio"),
            imageUrl: "/images/team/abel-v2.webp"
        },
        {
            id: 3,
            name: t("about.team_members.yusmel.name"),
            role: t("about.team_members.yusmel.role"),
            bio: t("about.team_members.yusmel.bio"),
            imageUrl: "/images/team/yusmel-v2.webp"
        },
        {
            id: 4,
            name: t("about.team_members.rebeca.name"),
            role: t("about.team_members.rebeca.role"),
            bio: t("about.team_members.rebeca.bio"),
            imageUrl: "/images/team/rebeca-v2.webp"
        }
    ];

    return (
        <section className="py-16 bg-background">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
                        {t("about.team.title", "The Team Behind the Cameras")}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("about.team.subtitle", "Professionals, yes. But above all, people who love to celebrate.")}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {team.map((member) => (
                        <Card key={member.id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] max-w-sm border-border hover:shadow-lg transition-shadow">
                            <div className="aspect-[2/3] overflow-hidden rounded-t-lg">
                                <img
                                    src={member.imageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"}
                                    alt={t("a11y.team_member_photo", { name: member.name, role: member.role, defaultValue: `${member.name} - ${member.role}` })}
                                    loading="lazy"
                                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                                />
                            </div>
                            <CardContent className="p-6 text-center">
                                <h3 className="text-xl font-serif font-semibold text-foreground mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-primary font-medium mb-3">
                                    {member.role}
                                </p>
                                {member.bio && (
                                    <p className="text-sm text-muted-foreground">
                                        {member.bio}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
