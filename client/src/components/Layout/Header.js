import React, { useContext, useState } from 'react'
import { NavLink, useLocation } from "react-router-dom"
import { Menu } from '@material-ui/icons'
import "../../css/tailwind.css"
import AuthContext from '../../context/authContext'
import Auth from '../Group/Auth'
import Logout from '../Group/Logout'

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user } = useContext(AuthContext)
    const location = useLocation()

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const isActive = (path) => {
        return location.pathname === path ? "border-b-2 border-sgreen-100 text-sgreen-100" : ""
    }
    return (
        <header className="bg-white w-screen h-14 flex justify-center items-center shadow-md fixed top-0 z-10" id="header">
            <nav className="w-full flex justify-between items-center px-9 lg:w-large text-xs ">
                <NavLink to="/" className="nav__logo header-navlink">
                    <i class="fa-solid fa-leaf text-sgreen-100"></i><span className='ml-2 uppercase font-extrabold text-sm'> stomascope</span>
                </NavLink>
                <div className='flex gap-10'>
                    <ul className='md:flex gap-10 hidden'>
                        <li><NavLink to="/" className={`header-navlink hover:decoration-sgreen-100 hover:decoration-2  hover:text-sgreen-100 ${isActive('/')}`}>Home</NavLink></li>

                        <li><NavLink to="/users/upload" className={`header-navlink hover:decoration-sgreen-100 hover:decoration-2  hover:text-sgreen-100 ${isActive('/users/upload')}`}>Upload</NavLink></li>

                        {/* <li><NavLink to="/users/history" className={`header-navlink hover:decoration-sgreen-100 hover:decoration-2  hover:text-sgreen-100 ${isActive('/users/history')}`}>History</NavLink></li> */}

                        <li className="relative">
                            <div
                                className={`header-navlink cursor-pointer hover:decoration-sgreen-100 hover:decoration-2 hover:text-sgreen-100 ${isActive('/users/history')}`}
                                onMouseEnter={handleDropdownToggle}
                                onMouseLeave={handleDropdownToggle}
                            >
                                History
                                {isDropdownOpen && (
                                    <div className="absolute text-xs top-full -left-3 bg-white rounded-md p-2">
                                        <NavLink to="/users/history/images" className="block text-black p-1 hover:text-sgreen-100 hover:bg-sgreen-50">Images</NavLink>
                                        <NavLink to="/users/history/videos" className="block text-black p-1 hover:text-sgreen-100 hover:bg-sgreen-50">Videos</NavLink>
                                    </div>
                                )}
                            </div>
                        </li>

                        <li><NavLink to='/faqs' className={`header-navlink hover:decoration-sgreen-100 hover:decoration-2  hover:text-sgreen-100 ${isActive('/faqs')}`}>FAQs</NavLink></li>

                        <li><NavLink className='header-navlink  hover:decoration-sgreen-100 hover:decoration-2  hover:text-sgreen-100'>Contact Us</NavLink></li>
                    </ul>
                </div>
                <div className='flex gap-10'>

                    {
                        !user ? <Auth /> : <Logout />
                    }

                </div>
                <div className='md:hidden'><Menu /></div>
            </nav>
        </header>
    )
}

export default Header