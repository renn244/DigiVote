import { Card } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const ResultStatsSkeleton = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-48" />
            </div>
            <Card className="p-6">
                <div className="max-h-[320px] w-full flex flex-col gap-4">
                    {/* Bar chart skeleton */}
                    <div className="flex items-end gap-4 justify-around h-[320px] ml-14 border-l-2 border-b border-gray-300 pl-4 pb-2">
                        {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <Skeleton
                            className="w-[147px] rounded-md"
                            style={{
                                height: `${Math.floor(Math.random() * 120) + 80}px`, // Random height between 80px and 200px
                            }}
                            />
                            <Skeleton className="h-4 mt-2 w-[125px]" />
                        </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ResultStatsSkeleton