import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import api from '../utils/api';

const Navbar = ({ bg }) => {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const [membershipActive, setMembershipActive] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    if (loggedIn) {
      const fetchMembershipStatus = async () => {
        try {
          const response = await api.get("membership/getmembership", { withCredentials: true });
          if (
            response.data.success &&
            Array.isArray(response.data.data) &&
            response.data.data.length > 0
          ) {
            const membership = response.data.data[0];
            setMembershipActive(membership.status === "active");
          } else {
            setMembershipActive(false);
          }
        } catch (error) {
          console.error("Error fetching membership status:", error);
          setMembershipActive(false);
        }
      };
      fetchMembershipStatus();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      const fetchUserRole = async () => {
        try {
          const response = await api.get("auth/role", { withCredentials: true });
          setUserRole(response.data.role);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };
      fetchUserRole();
    }
  }, [loggedIn]);

  const baseNavItems = [
    { name: 'Scan', path: '/scan' },
    { name: 'Generate', path: '/generate' },
    { name: 'Contact', path: '/contact' },
  ];

  const navItems =
    loggedIn && userRole === "USER"
      ? baseNavItems.filter(item => item.name !== "Scan")
      : baseNavItems;

  return (
    <nav className={`fixed w-full top-0 left-0 backdrop-blur-md bg-${bg} h-18 flex items-center px-6 shadow-md z-50`}>
      <ul className="flex items-center justify-between w-full">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-xl font-medium transition duration-200 ${
              isActive
                ? 'text-orange-500 shadow-orange-500/50 shadow-md rounded-full p-1'
                : 'text-white'
            }`
          }
        >
          <img src={logo} alt="Logo" className="h-16 transition duration-300" />
        </NavLink>

        <div className="flex gap-8">
          {navItems.map((item) => (
            <li key={item.name} className="list-none">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-lg font-medium transition duration-200 ${
                    isActive ? 'text-orange-500' : 'text-white hover:text-orange-400'
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </div>

        {!loggedIn ? (
          <NavLink
            to="/login"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold text-lg transition duration-200 hover:bg-orange-600 active:bg-orange-700"
          >
            Login
          </NavLink>
        ) : membershipActive ? (
          <NavLink
            to="/profile"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold text-lg transition duration-200 hover:bg-orange-600 active:bg-orange-700"
          >
            Profile
          </NavLink>
        ) : (
          <NavLink
            to="/membership"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold text-lg transition duration-200 hover:bg-orange-600 active:bg-orange-700"
          >
            Join Now
          </NavLink>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
