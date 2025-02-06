import { CalendarIcon, Users, VoteIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import GoBackButton from "../common/GoBackButton";
import ResultStatsSkeleton from "./ResultStats.skeleton";

const ResultSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-9 w-48 rounded" />
          <Skeleton className="h-[34px] w-20 rounded" />
        </div>
        <GoBackButton to="/results">
          Back to Results
        </GoBackButton>
      </div>

      <div className="mb-4">
        <ResultStatsSkeleton />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Election Statistics Card */}
        <Card className="overflow-hidden border border-gray-200">
          <CardHeader className="bg-yellow-400 text-yellow-900 p-6">
            <CardTitle>
              <Skeleton className="h-8 w-40 rounded" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="mr-2 h-5 w-5 text-yellow-600" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <div className="flex items-center space-x-2">
                  <VoteIcon className="mr-2 h-5 w-5 text-yellow-600" />
                  <Skeleton className="h-4 w-28 rounded" />
                </div>
              </div>
              {/* Right Column */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="mr-2 h-5 w-5 text-yellow-600" />
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
              </div>
            </div>
            <Skeleton className="h-6 w-32 rounded" />
            <div className="mt-4">
              <Skeleton className="h-4 w-40 mb-2 rounded" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates / Winning Parties Card */}
        <Card className="overflow-hidden border border-gray-200">
          <CardHeader className="bg-yellow-400 text-yellow-900 p-6">
            <CardTitle>
              <Skeleton className="h-8 w-40 rounded" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Simulate a list of candidates or parties */}
            <div className="flex flex-col space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex flex-col space-y-2">
                    <Skeleton className="h-6 w-36 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Winning Candidates Card */}
      <Card className="mt-8 overflow-hidden border border-gray-200">
        <CardHeader className="bg-yellow-400 text-yellow-900 p-6">
          <CardTitle>
            <Skeleton className="h-8 w-40 rounded" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <li key={idx} className="border-b border-gray-200 last:border-b-0 pb-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-24 rounded" />
                  <Skeleton className="h-6 w-16 rounded" />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-64 rounded" />
                    <Skeleton className="h-6 w-16 rounded" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResultSkeleton