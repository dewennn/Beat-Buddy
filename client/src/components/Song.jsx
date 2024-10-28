import React from 'react'

const Song = ({songName, artistName, onClickDoThis, hover, deleteable, width}) => {
  return (
    <button
      className={`raleway text-white flex gap-5 p-5 text-left ${hover ? 'hover:bg-[rgba(30,224,98,0.3)]' : ''} rounded-lg ${width} transition-all ease-in-out relative`}
      onClick={onClickDoThis}
    >
      <div>
        <img className='w-10' src="assets/beat.png" alt="" />
      </div>

      <div>
        <h1 className='text-xl font-bold'>{songName}</h1>
        <p className='font-semibold'>{artistName}</p>
      </div>

      {
        deleteable ? 
        <button className='w-7 absolute right-0 top-0'><img src="assets/x.png" alt="" /></button> : ''
      }
    </button>
  )
}

export default Song