import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate()

  return (
    <header className='flex justify-between raleway px-10 py-5'>
      <button onClick={() => {navigate('/')}} className='flex items-center gap-5'>
        <div className='w-14'>
          <img src="assets/logo.png" alt="" />
        </div>
        <h1 className='text-white font-extrabold text-3xl'>Beat Buddy</h1>
      </button>

      <div className='text-white text-end font-semibold'>
        <p>A machine learning project hosted in a full-stack web application made with react & flask.</p>
        <p>Made by: Derren Malaka, Hendra Putra & Kelsten Wuihan</p>
        <a className='text-[#1EE062]' href="/about-this">Find more details regarding the project development here.</a>
      </div>
    </header>
  )
}

export default Header