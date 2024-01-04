import React from 'react'

const ProfilePlaceholder = (props) => {
    const name = props.name.split(" ");
    const i1 = name[0][0];
    const i2 = name.length === 1 ? name[0][1] : name[1][0];

    const getSize = size => size < 10 ? `w-${size} h-${size}  text-xs p-1 ` : `w-${size} h-${size} py-2`

    return (
        <div className={`${props.size ? getSize(props.size) : getSize(10)} text-center font-semibold  rounded-full outline outline-1 outline-bg-primary ${props.lightTheme ? "bg-slate-200 text-text-tertary" : "dark"} `}>
            <span>{i1.toUpperCase()}</span><span>{i2.toUpperCase()}</span>
        </div>
    )
}

export default ProfilePlaceholder