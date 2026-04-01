import React from 'react'
import { Button } from './ui/button'
import { Link} from 'react-router-dom'
import { Input } from './ui/input'
import Logo from "../assets/logo.png"
import {Search} from 'luicide-react'
import {FaMoon } from 'react-icons/fa'


const Navbar = () => {
  const user = false;

  return (
    <div className="py-2 fixed w-full z-50 bg-white dark:bg-gray-800 dark:border-b-gray-600 border-b border-gray-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">

        {/* Logo Section */}
        <div className="flex gap-7 items-center">
          <div>
            <h1 className="text-xl font-bold">Logo</h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex md:gap-7 gap-4 items-center">
          <ul className="hidden md:flex gap-7 items-center text-xl font-semibold">
            <Link to={"/"}>
              <li>Home</li>
            </Link>
            <Link to={"/blogs"}>
              <li>Blogs</li>
            </Link>
            <Link to={"/about"}>
              <li>About</li>
            </Link>
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Button>
              <FaMoon />
            </Button>

            {
              user ? (
                <div>
                  {/* User content (profile, logout, etc.) */}
                </div>
              ) : (
                <div className="ml-7 md:flex gap-2">
                  <Link to={"/login"}>
                    <Button>Login</Button>
                  </Link>

                  <Link className="hidden md:block" to={"/signup"}>
                    <Button>Signup</Button>
                  </Link>
                </div>
              )
            }
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;

