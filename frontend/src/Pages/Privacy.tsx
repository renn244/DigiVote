import { Card, CardContent } from "@/components/ui/card"

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>

                <Card className="bg-white text-blue-900">
                    <CardContent className="p-6 space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                            <p>
                                DigiVote ("we", "our", or "us") is committed to protecting your privacy and ensuring the security of
                                your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard
                                your information when you use our digital voting platform. We adhere to the Data Privacy Act of 2012
                                (Republic Act No. 10173) and its Implementing Rules and Regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                            <p>We collect the following types of information:</p>
                            <ul className="list-disc pl-6 mt-2">
                                <li>Personal information (e.g., name, email address, student ID)</li>
                                <li>Voting records (anonymized)</li>
                                <li>Device and usage information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                            <p>We use your information to:</p>
                            <ul className="list-disc pl-6 mt-2">
                                <li>Facilitate and manage the voting process</li>
                                <li>Ensure the security and integrity of elections</li>
                                <li>Improve our services and user experience</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Data Protection and Security</h2>
                            <p>We implement robust security measures to protect your information, including:</p>
                            <ul className="list-disc pl-6 mt-2">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security audits and vulnerability assessments</li>
                                <li>Access controls and authentication mechanisms</li>
                                <li>Employee training on data protection</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                            <p>Under the Data Privacy Act of 2012, you have the right to:</p>
                            <ul className="list-disc pl-6 mt-2">
                                <li>Access your personal information</li>
                                <li>Correct inaccuracies in your personal information</li>
                                <li>Object to the processing of your personal information</li>
                                <li>Erasure or blocking of your personal information</li>
                                <li>File a complaint with the National Privacy Commission</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                                new Privacy Policy on this page and updating the "Last Updated" date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                            <p className="mt-2">
                                DigiVote
                                <br />
                                123 Ayala Avenue, Makati City, Metro Manila, Philippines
                                <br />
                                Email: privacy@digivote.ph
                                <br />
                                Phone: +63 2 8123 4567
                            </p>
                        </section>

                        <p className="text-sm mt-8">Last Updated: Jan 31, 2025</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Privacy