import React from 'react'
import Sidebar from './Sidebar'

const NavDrawer = () => {
    return (
        <>
            {/* component */}
            <div className="flex ">
                <input type="checkbox"
                    id="drawer-toggle"
                    className="relative sr-only peer"
                    defaultChecked=""
                />
                <label
                    htmlFor="drawer-toggle"
                    className="absolute top-2 left-1 cursor-pointer inline-block px-4 py-3 transition-all duration-500 bg-bg-primary rounded-lg peer-checked:rotate-180 peer-checked:left-64"
                >
                    <div className="w-4 h-1 mb-1.5 -rotate-45 bg-white rounded-lg" />
                    <div className="w-4 h-1 rotate-45 bg-white rounded-lg" />
                </label>
                <div className="fixed top-0 left-0 z-20 w-64 h-full transition-all duration-500 transform -translate-x-full bg-white shadow-lg peer-checked:translate-x-0">
                    <Sidebar />
                </div>
            </div>
        </>
    )
}

export default NavDrawer