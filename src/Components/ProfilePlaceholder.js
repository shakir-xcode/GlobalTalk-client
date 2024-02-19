import React from 'react'

const ProfilePlaceholder = (props) => {
    const name = props.name.split(" ");
    const i1 = name[0][0];
    const i2 = name.length === 1 ? name[0][1] : name[1][0];

    const getSize = size => size < 10 ? `w-${size} h-${size}  text-sm p-1 ` : `w-${size - 3} h-${size} p-1 text-sm  `

    return (
        <div className={`${props.size ? getSize(props.size) : getSize(8)}  grid place-content-center text-center rounded-full font-semibold   outline outline-1 outline-bg-primary ${props.lightTheme ? "bg-slate-200 text-text-tertary" : "dark"} `}>
            <div className=''><span>{i1.toUpperCase()}</span><span>{i2.toUpperCase()}</span></div>
        </div>
    )
}

export default ProfilePlaceholder