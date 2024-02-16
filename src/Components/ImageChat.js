import React from 'react'
import { baseURI, staticURI } from '../api/appApi';
import { isImageFile, getFileName } from '../utility/getExtension';
import pdf_icon from "../Images/pdf_icon.svg"
import file_icon from "../Images/file_icon.svg"
import video_preview_icon from "../Images/video_preview_icon.png"
import axios from 'axios';


const ImageChat = ({ filename, selfMessage, mimetype }) => {
  const filePath = `${staticURI}${filename}`;
  let icon;
  const mediaType = mimetype;

  if (mediaType.includes('pdf'))
    icon = pdf_icon;
  else if (mediaType.includes('video'))
    icon = video_preview_icon;
  else
    icon = file_icon

  const downloadRoute = baseURI + "/message/download/" + filename;

  const downloadResource = async () => {
    if (selfMessage) return;
    try {
      const response = await axios.get(downloadRoute, {
        responseType: 'blob', // Set responseType to 'blob' for binary data
      });

      // Create a blob from the response data
      const blob = new Blob([response.data]);

      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename; // Set the desired file name
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }

  }

  return (
    <div
      onClick={downloadResource}
      className={`max-w-[200px] px-0.5 py-0.5 bg-cyan-50 rounded-lg ${selfMessage ? "rounded-br-none" : "rounded-bl-none cursor-pointer"}`}>
      {isImageFile(filename) ?
        <img className='w-[100%] rounded-md' src={filePath} alt='chatImage' />
        :
        <div className=' px-3 py-1 flex gap-2 items-start'>
          <img src={icon} alt={mimetype} className='w-7 self-center ' />
          <div className='self-center'>
            <p style={{ wordWrap: 'break-word' }} className='text-[0.8rem] text-slate-600 '>{getFileName(filename, 30)}</p>
          </div>
        </div>
      }
    </div>
  )
}

export default ImageChat