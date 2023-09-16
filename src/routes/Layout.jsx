import { Outlet,Link } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/parameter/">Edit parameter</Link>
                        </li>
                        <li>
                            <Link to="/calculate">calculate</Link>
                        </li>
                        </ul>
                </nav>
            </header>


            <h1>Water parameter calculator</h1>
            <Outlet />
        </div>
    )
}

export default Layout;