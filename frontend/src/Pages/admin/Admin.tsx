import SideBar from "@/components/pages/admin/SideBar"
import { Route, Routes } from "react-router"
import Polls from "./Polls"
import UpdatePoll from "@/components/pages/admin/Poll/UpdatePoll"

const Admin = () => {
    return (
        <div className="flex">
            <SideBar />
            <main className="flex-1 p-8">
                <Routes>
                    <Route path="/polls" element={<Polls />} />
                    <Route path="/polls/update/:id" element={<UpdatePoll />} />
                </Routes>
            </main>
        </div>
    )
}

export default Admin