import ElectionCard from "@/components/pages/ElectionCard"

const elections = [
  {
    id: 1,
    title: "2024 Presidential Election",
    description: "National election to choose the next president of the United States. This election will determine the country's leadership for the next four years.",
    branch: "Federal",
    start_date: "2024-11-03T00:00:00Z",
    end_date: "2024-11-03T23:59:59Z",
    vote_type: "single",
    location: "Nationwide",
    parties: ["Democratic Party", "Republican Party", "Green Party", "Libertarian Party"]
  },
  {
    id: 2,
    title: "2024 Senate Election",
    description: "Election for Senate seats in various states. The outcome will influence the balance of power in the upper chamber of Congress.",
    branch: "Federal",
    start_date: "2024-11-03T00:00:00Z",
    end_date: "2024-11-03T23:59:59Z",
    vote_type: "multiple",
    location: "Multiple States",
    parties: ["Democratic Party", "Republican Party", "Independent"]
  },
  {
    id: 3,
    title: "Local School Board Election",
    description: "Election for local school board members who will make important decisions about education policies and budgets in your community.",
    branch: "Local",
    start_date: "2023-09-15T00:00:00Z",
    end_date: "2023-09-15T20:00:00Z",
    vote_type: "multiple",
    location: "Your City",
    parties: ["Community First", "Education Forward", "Taxpayers Alliance"]
  },
  {
    id: 4,
    title: "State Governor Election",
    description: "Election for the state governor who will lead the executive branch of your state government and shape state-wide policies.",
    branch: "State",
    start_date: "2024-03-01T00:00:00Z",
    end_date: "2024-03-01T21:00:00Z",
    vote_type: "single",
    location: "Your State",
    parties: ["Democratic Party", "Republican Party", "Independent"]
  },
]

const Elections = () => {

  // request data for available election in your branch

  return (
      <div className="min-h-[855px] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h1 className="text-4xl font-bold text-blue-900 mb-8">
                  Upcoming Elections
              </h1>
              <div className="grid gap-8 md:grid-cols-2">
                  {elections.map((election) => (
                      <ElectionCard key={election.id} election={election} />
                  ))}
              </div>
          </div>
      </div>
  )
}

export default Elections