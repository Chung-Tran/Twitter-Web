import Menu from "./component/Menu/Menu"
import Navbar from "./component/Navbar/Navbar"

const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex', backgroundColor:'black' }}>
            <Navbar />
            <main>{children}</main>
            <Menu />
        </div>
    )
}
export default Layout