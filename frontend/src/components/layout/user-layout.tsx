import { UserNavbar } from "../user/navbar"

const UserLayout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <>
            <UserNavbar />
            {children}
        </>
    )
}

export default UserLayout