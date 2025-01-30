import { FeatureCard, Step, TestimonialCard } from "@/components/pages/Design/UtilCard";
import { Button } from "@/components/ui/button";
import { BarChart2, CheckCircle, Clock, Globe, HelpCircle, Shield, Users } from "lucide-react";
import { Link } from "react-router";

const About = () => {

    return (
        <div className="bg-white">
            
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center text-white">
                <img 
                src="https://res.cloudinary.com/dxocuabaq/image/upload/v1738231297/sti-voting/website/wqgy1ppafzo4xqpwktxh.jpg"
                alt="Students participating in digital voting"
                className="absolute inset-0 h-[70vh] overflow-hidden"
                />
                <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
                <div className="relative z-10 text-center max-w-4xl px-4">
                    <h1 className="text-5xl font-bold mb-6">Welcome to DigiVote</h1>
                    <p className="text-xl mb-8">
                        Empowering student voices through secure, accessible, and transparent digital
                        voting. Experience the future of campus democracy with DigiVote.
                    </p>
                    <Button asChild size="lg" className="bg-yellow-400 text-blue-900">
                        <Link to={'/register'}>
                            Get Started Today
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto flex flex-col lg:flex-row gap-6">
                    <div className="px-4">
                        <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">Our Mission</h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto text-center leading-relaxed">
                            At DigiVote, we're committed to revolutionizing the voting process in educational Institutions. Our mission is to provide
                            a secure, transparent, and accessible digital voting platform that empowers students to actively participate in their school's democratic
                            processes. We believe that by simplifying the voting experience and ensuring the integrity of each election, we can foster greater engagement
                            in student governance and prepare the leaders of tommorow.
                        </p>
                    </div>
                    <div className="px-4">
                        <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">Our Vision</h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto text-center leading-relaxed">
                            <i className="font-bold">Empowering the Future of Student Democracy. </i> 
                            At DigiVote, we envision a future where every student has the power to shape their institution through a seamless, transparent, and secure digital voting system. 
                            We strive to cultivate a culture of active participation, where technology bridges the gap between students and governance. By pioneering innovative voting solutions, 
                            we aim to inspire a new generation of leaders who value integrity, inclusivity, and civic responsibility.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">Key Features</h2>
                    <div className="grid justify-center md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <FeatureCard 
                        icon={Shield}
                        title="Secure Voting"
                        description="Our state-of-the-art security and authentication measure ensure the integrity of 
                        every vote. With DigiVote, students can trust that their voices are heard and their votes are protected"
                        />
                        <FeatureCard
                        icon={Users}
                        title="Inclusive Participation"
                        description="DigiVote is designed to accommodate various education levels and departments, ensuring all eligible students can participate. Our platform breaks down barriers to voting, making the process accessible to everyone."
                        />
                        <FeatureCard
                        icon={BarChart2}
                        title="Real-time Results"
                        description="Experience the excitement of instant tabulation and visualization of voting results. DigiVote provides transparency and quick insights, allowing the entire student body to stay informed and engaged throughout the election process."
                        />
                        <FeatureCard
                        icon={Globe}
                        title="Remote Accessibility"
                        description="Vote from anywhere, at any time during the election period. Whether you're on campus or studying abroad, DigiVote ensures that distance is never a barrier to participating in your school's democratic process."
                        />
                        <FeatureCard
                        icon={CheckCircle}
                        title="User-Friendly Interface"
                        description="Our intuitive interface makes the voting process simple and straightforward for all users. From registration to casting your vote, DigiVote guides you through each step with clarity and ease."
                        />
                        <FeatureCard
                        icon={Clock}
                        title="Efficient Administration"
                        description="For election administrators, DigiVote streamlines the entire process. Set up polls, manage voter eligibility, and oversee results with our comprehensive suite of administrative tools."
                        />
                    </div>
                </div>
            </section>
            
            {/* How It Works Section */}
            <section className="py-20 bg-blue-900 text-white">
                <div className="container max-w-[1760px] mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">How DigiVote Works</h2>
                    <div className="px-4 grid gap-10 xl:gap-5 xl:grid-cols-2 items-center">
                        <div className="space-y-10">
                            <Step number={1} title="User Registration">
                                Students easily register using their school credentials. Our system verifies
                                eligibilit, ensuring only authorized students can participate in the voting process.
                            </Step>
                            <Step number={2} title="Poll Creation">
                                Administrators create polls, set specific eligibility criteria, and add candidates or voting options.
                                This flexible system allows for various types of elections, from student council to campus-wide
                                referendums.
                            </Step>
                            <Step number={3} title="Secure Voting">
                                Eligible students receive notifications about open polls. They can then cast their votes securely within
                                the specified timeframe, using any device with internet access.
                            </Step>
                            <Step number={4} title="Real-Time Results">
                                As votes are cast, they are securely tallied in real-time. Once the poll closes, results are instantly
                                available and can be published according to the predetermined settings.
                            </Step>
                        </div>
                        <img src="https://res.cloudinary.com/dxocuabaq/image/upload/v1738232990/sti-voting/website/i2owx0xrmmgue4xi1poo.jpg"
                        alt="DigiVote process" className="object-fill relative rounded-lg overflow-hidden shadow-xl" />
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">
                        What Students Say
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <TestimonialCard 
                        quote="DigiVote made it incredibly easy for me to participate in our student
                        council elections. I love how I could vote from anywhere, even while I was studying abroad!"
                        author="Sarah J., Junior"
                        imageUrl="https://res.cloudinary.com/dxocuabaq/image/upload/v1738232338/sti-voting/website/c6gmmzewqjsrgroxbwjz.png"
                        />
                        <TestimonialCard
                        quote="As a student leader, I appreciate the transparency and real-time results that DigiVote provides. It's truly a game-changer for our campus democracy."
                        author="Michael T., Senior"
                        imageUrl="https://res.cloudinary.com/dxocuabaq/image/upload/v1738232339/sti-voting/website/nkou99y6usd5mku39ybt.png"
                        />
                        <TestimonialCard
                        quote="The security features of DigiVote gave me confidence that my vote was being counted accurately. It's great to have a system we can trust for our important campus decisions."
                        author="Emily R., Sophomore"
                        imageUrl="https://res.cloudinary.com/dxocuabaq/image/upload/v1738232337/sti-voting/website/yskw6nnyvr8aon60mlyy.png"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Sectio */}
            <section className="py-20 bg-yellow-400">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-blue-900 mb-4">Ready to experience modern campus voting?</h2>
                    <p className="text-xl text-blue-800 mb-8">
                        Join thousands of students already using DigiVote to make their voices heard
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button asChild size={"lg"} className="bg-blue-900 text-white hover:bg-blue-800">
                            <Link to={'/register'}>
                                Register Now
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-blue-900 text-blue900 hover:bg-blue-100">
                            <Link to={'/help'}>
                                <HelpCircle className="mr-2 h-5 w-5" />
                                Learn More
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About