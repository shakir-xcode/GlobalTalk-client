import React from 'react'
import tempImage from '../Images/tempImage.jpg';
const ImageChat = () => {
  return (
    <div className='max-w-[200px] p-3 bg-slate-200'>
      <img className='w-[100%]' src={tempImage} alt='chatImage' />
    </div>
  )
}

export default ImageChat