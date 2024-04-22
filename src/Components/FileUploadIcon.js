import React from "react";
import fileUpload_Icon from "../Images/file_upload.svg";

const FileUploadIcon = ({ setSelectedFile }) => {

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        e.target.value = '';
        setSelectedFile(() => file);
    };


    return (
        <div className=" relative mt-2 mr-4 ">
            <div className=" absolute inset-0 cursor-pointer"
                onClick={() => {
                    alert('This feature has been disabled temporarily')
                }}
            ></div>

            <input type="file" name="file" id="actual-btn" hidden onChange={handleFileChange} />
            <label htmlFor="actual-btn" className="cursor-pointer " title="upload">
                <img className=" w-8 " src={fileUpload_Icon} alt="file upload" />
            </label>

        </div>
    );
};

export default FileUploadIcon;
