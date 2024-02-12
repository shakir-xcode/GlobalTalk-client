import axios from 'axios';
import React, { useState, useEffect } from 'react';
import SendIcon from "../Images/send_icon.svg";
import { baseURI } from '../api/appApi';
import file_icon from "../Images/file_icon.svg";
import pdf_icon from "../Images/pdf_icon.svg";
import video_preview_icon from "../Images/video_preview_icon.png";

const uploadRoute = baseURI + "/message/uploads/"

const FilePreviewer = ({ selectedFile, setSelectedFile, chatId, syncMsg, lightTheme }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [mediaType, setMediaType] = useState(null);

    const userData = JSON.parse(localStorage.getItem("userData"));


    useEffect(() => {
        const reader = new FileReader();

        reader.onload = () => {
            setPreviewUrl(reader.result);
        };

        if (selectedFile) {
            setMediaType(selectedFile.type)
            if (selectedFile.type.includes('image'))
                reader.readAsDataURL(selectedFile);
            else if (selectedFile.type.includes('video'))
                setPreviewUrl(video_preview_icon);
            else if (selectedFile.type.includes('pdf'))
                setPreviewUrl(pdf_icon);
            else
                setPreviewUrl(file_icon);
        }
    }, []);

    const handleUpload = async () => {
        setSelectedFile(null);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("mediaType", mediaType);
            formData.append('chatId', chatId)


            const response = await axios.post(uploadRoute, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${userData.data.token}`,
                },
            });

            console.log("Response:", response.data);
            syncMsg(response.data);
        } catch (error) {
            console.error("Error uploading image:", error);
        }

    };

    return (
        <div className={'w-full h-[380px] md:h-[430px]  p-6 rounded-t-2xl' + (lightTheme ? " bg-bg-secondary " : " dark shadow border-t-2 border-slate-500  shadow-slate-500")}>
            <div className=' mx-auto  flex flex-col gap-4 items-center justify-between max-w-[460px] h-full'>
                <div className=' border w-full h-[260px] '>
                    {previewUrl && (
                        <img src={previewUrl} alt="Preview"
                            className='w-full h-full object-contain' />
                    )}
                </div>

                <button className=" mt-4 font-semibold text-slate-200 px-4 py-2 bg-bg-primary rounded cursor-pointer hover:opacity-80"
                    onClick={handleUpload}
                    disabled={!selectedFile}>
                    SEND
                    {/* <img src={SendIcon} alt='send' className='w-7 rotate-45' /> */}
                </button>
            </div>
        </div>
    );
};

export default FilePreviewer;
