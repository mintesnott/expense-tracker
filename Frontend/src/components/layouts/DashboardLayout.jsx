import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

import Modal from "../Modal";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user, clearUser} = useContext(UserContext);

    const navigate = useNavigate();

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    return (
        <div className="">
            <Navbar 
                activeMenu={activeMenu} 
                onLogout={() => setShowLogoutConfirm(true)}
            />

            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        <SideMenu 
                            activeMenu={activeMenu} 
                            onLogout={() => setShowLogoutConfirm(true)}
                        />
                    </div>

                    <div className="grow mx-5">{children}</div>
                </div>
            )}


            <Modal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                title="Logout"
            >
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <span className="text-2xl">⚠️</span>
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                    Are you sure you want to logout?
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-4">
                    You will be signed out of your Expense Tracker account.
                </p>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={() => setShowLogoutConfirm(false)}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 dark:text-white dark:hover:bg-slate-900 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="add-btn add-btn-fill-warn "
                    >
                        Yes, Logout
                    </button>
                </div>
            </Modal>

            
        </div>
    );
};

export default DashboardLayout;

