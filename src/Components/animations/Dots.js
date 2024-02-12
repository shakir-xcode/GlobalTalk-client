import React from 'react'
import "./style.css"

const Dots = () => {
    return (
        <div className="loader w-fit h-fit">
            <div className="dot1 animate-dot"></div>
            <div className="dot2 animate-dot"></div>
            <div className="dot3 animate-dot"></div>
        </div>
    )
}

export default Dots