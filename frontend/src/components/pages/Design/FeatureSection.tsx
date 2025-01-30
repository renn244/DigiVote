import { BarChart2, CheckCircle, Clock, Globe, Shield, Users } from "lucide-react"
import { FeatureCard } from "./UtilCard"
import { cn } from "@/lib/utils"

type FeatureCardProps = {
    headerStatement: string,
    className?: string
}

const FeatureSection = ({
    headerStatement,
    className
}: FeatureCardProps) => {
    return (
        <section className={cn("py-20", className)}>
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">{headerStatement}</h2>
                <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-12">
                    <FeatureCard data-aos="zoom-in" data-aos-duration="300" data-aos-delay=""
                    icon={Shield}
                    title="Secure Voting"
                    description="Our state-of-the-art security and authentication measure ensure the integrity of 
                    every vote. With DigiVote, students can trust that their voices are heard and their votes are protected"
                    />
                    <FeatureCard data-aos="zoom-in" data-aos-duration="300" data-aos-delay="200"
                    icon={Users}
                    title="Inclusive Participation"
                    description="DigiVote is designed to accommodate various education levels and departments, ensuring all eligible students can participate. Our platform breaks down barriers to voting, making the process accessible to everyone."
                    />
                    <FeatureCard data-aos="zoom-in" data-aos-duration="300" data-aos-delay="400"
                    icon={BarChart2}
                    title="Real-time Results"
                    description="Experience the excitement of instant tabulation and visualization of voting results. DigiVote provides transparency and quick insights, allowing the entire student body to stay informed and engaged throughout the election process."
                    />
                    <FeatureCard data-aos="zoom-in" data-aos-duration="300" data-aos-delay="600"
                    icon={Globe}
                    title="Remote Accessibility"
                    description="Vote from anywhere, at any time during the election period. Whether you're on campus or studying abroad, DigiVote ensures that distance is never a barrier to participating in your school's democratic process."
                    />
                    <FeatureCard data-aos="zoom-in" data-aos-duration="300" data-aos-delay="800"
                    icon={CheckCircle}
                    title="User-Friendly Interface"
                    description="Our intuitive interface makes the voting process simple and straightforward for all users. From registration to casting your vote, DigiVote guides you through each step with clarity and ease."
                    />
                    <FeatureCard data-aos="zoom-in" data-aos-duration="300" data-aos-delay="1000"
                    icon={Clock}
                    title="Efficient Administration"
                    description="For election administrators, DigiVote streamlines the entire process. Set up polls, manage voter eligibility, and oversee results with our comprehensive suite of administrative tools."
                    />
                </div>
            </div>
        </section>
    )
}

export default FeatureSection