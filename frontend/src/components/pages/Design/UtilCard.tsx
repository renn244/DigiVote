import { Card, CardContent } from "@/components/ui/card";

export const FeatureCard = ({
    icon: Icon,
    title,
    description,
    ...props
}: { icon: any; title: string; description: string; }) => (
    <Card {...props} className="overflow-hidden transition-all duration-300 hover:shadow-lg max-w-[400px]">
        <CardContent className="p-6">
            <div className="flex items-center mb-4">
                <Icon className="h-8 w-8 text-yellow-500 mr-3" />
                <h3 className="text-2xl font-semibold text-blue-900">{title}</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">{description}</p>
        </CardContent>
    </Card>
)

export const Step = ({
    number, title, children, ...props
}: { number: number, title: string, children: React.ReactNode }) => (
    <div {...props} className="flex items-start">
        <div className="bg-yellow-400 text-blue-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
            {number}
        </div>
        <div>
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-blue-100 leading-relaxed">{children}</p>
        </div>
    </div>
)

export const TestimonialCard = ({
    quote, author, imageUrl, ...props
}: { quote: string, author: string, imageUrl: string }) => (
    <Card {...props} className="p-6 hover:shadow-lg transition-all duration-300">
        <CardContent className="space-y-4 h-full">
            <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <img src={imageUrl} alt={author} />
                </div>
            </div>
            <p className="text-gray-700 text-center italic leading-relaxed">{quote}</p>
            <p className="text-blue-900 font-semibold text-center mt-auto">{author}</p>
        </CardContent>
    </Card>
)

export const Statistic = ({ value, label, ...props }: { value: string, label: string }) => (
    <div {...props}>
        <div className="text-4xl font-bold text-yellow-400 mb-2">
            {value}
        </div>
        <div className="text-xl">
            {label}
        </div>
    </div>
)