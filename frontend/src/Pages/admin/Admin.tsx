import SideBar from "@/components/pages/admin/SideBar"

const Admin = () => {
    return (
        <div className="flex">
            <SideBar />
            <main className="flex-1 p-8">
                <h2>Hello world</h2>
            </main>
        </div>
    )
}

export default Admin