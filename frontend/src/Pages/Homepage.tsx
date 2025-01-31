import FeatureSection from "@/components/pages/Design/FeatureSection"
import { Statistic, Step } from "@/components/pages/Design/UtilCard"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from "react"

const Homepage = () => {

    useEffect(() => {
        AOS.init();
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center">
                <div data-aos="fade-right" data-aos-duration="500" className="lg:w-1/2 mb-10 lg:mb-0">
                    <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                        Empower Your Campus Voice
                    </h1>
                    <p className="text-xl mb-8">
                        DigiVote brings secure, accessible, and transparent digital voting to your educational institution. Make every student's voice count.
                    </p>
                    <Button asChild size="lg" className="bg-yellow-400 text-blue-900">
                        <Link to={'/elections'}>Start Voting Now</Link>
                    </Button>
                </div>
                <div data-aos="fade-left" data-aos-duration="500" data-aos-delay="200" className="lg:w-1/2">
                    <img src="https://res.cloudinary.com/dxocuabaq/image/upload/v1738236990/sti-voting/website/mqdae2gtfmxnfhoiqhyj.jpg"
                    className="rounded-lg shadow-2xl  h-[400px]" alt="Students using DigiVote" />
                </div>
            </section>
    
            {/* Statistics Section */}
            <section className="bg-blue-800 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <Statistic data-aos="fade-up" data-duration="350" data-aos-delay=""
                        value="10+" label="STI branches" />
                        <Statistic data-aos="fade-up" data-duration="350" data-aos-delay="200"
                        value="10k" label="Student Voters" />
                        <Statistic data-aos="fade-up" data-duration="350" data-aos-delay="400"
                        value="85+" label="Election Held" />
                        <Statistic data-aos="fade-up" data-duration="350" data-aos-delay="600"
                        value="+40%" label="Voter Turnout Increase" />
                    </div>
                </div>
            </section>
    
            {/* Features Section */}
            <FeatureSection className="bg-white text-blue-900" headerStatement="Why STI Chooses DigiVote" />
    
            {/* How It Works Section */}
            <section className="bg-blue-800 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        DigiVote In Action at STI
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Step number={1} title="Secure Authentication">
                            Log in with your STI credentials, verified through multi-factor authentication
                        </Step>
                        <Step number={2} title="Access STI Elections">
                            View and participate in elections specific to your department or institute-wide polls
                        </Step>
                        <Step number={3} title="Cast Encrypted Votes">
                            Submit your choices using our quantum-resistant encryption protocols
                        </Step>
                        <Step number={4} title="Analyze Results">
                            Explore detailed analytics and visualizations of election outcomes
                        </Step>
                    </div>
                </div>
            </section>
    
            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 text-center">
                <p>&copy; 2023 DigiVote for STI. All rights reserved.</p>
                <div className="mt-4">
                <Link to="/about" className="text-yellow-400 hover:underline underline-offset-4 mr-4">
                    About
                </Link>
                <Link to="/contact" className="text-yellow-400 hover:underline underline-offset-4 mr-4">
                    Contact
                </Link>
                <Link to="/privacy" className="text-yellow-400 hover:underline underline-offset-4">
                    Privacy Policy
                </Link>
                </div>
            </footer>
        </div>
    )
}

export default Homepage