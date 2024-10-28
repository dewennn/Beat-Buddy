import React from 'react'
import Header from './Header'

const AboutUs = () => {
  return (
    <div className='bg-[#141414]'>
      <Header />
      <div className='raleway text-white w-full min-h-screen flex p-5 gap-5'>
        <div className='bg-[#1C1C1C] w-full p-10 rounded-lg flex flex-col gap-5'>
          <h1 className='text-[#1EE062] font-bold text-3xl'>Our Team</h1>
          <div className='flex flex-col gap-3'>
            <div>
              <h1 className='font-semibold text-xl'>Derren Malaka</h1>
              <h2 className='underline font-semibold'>Project Leader & Head Developer</h2>
              <a className='text-blue-300' href="https://www.linkedin.com/in/derren-malaka" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>

            <div>
              <h1 className='font-semibold text-xl'>Hendra Putra</h1>
              <h2 className='underline font-semibold'>Head Machine Learning Developer</h2>
              <a className='text-blue-300' href="https://www.linkedin.com/in/hendra-putra-897504295/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>

            <div>
              <h1 className='font-semibold text-xl'>Kelsten Wuihan</h1>
              <h2 className='underline font-semibold'>Head Designer</h2>
              <a className='text-blue-300' href="https://www.linkedin.com/in/kelsten-wuisan/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className='bg-[#1C1C1C] w-full p-10 rounded-lg flex flex-col gap-5'>
          <h1 className='text-[#1EE062] font-bold text-3xl'>Overview</h1>
          <p>
          Beat buddy is a machine learning project we made on our 4th semester. <br />
          - It’s a Music Recommender System made using Machine Learning. <br />
          - We put it to form as a Web Application made with React & Flask<br /> <br />

          The dataset is taken from <a className='text-blue-300' href="https://www.kaggle.com/datasets/joebeachcapital/30000-spotify-songs" target="_blank" rel="noopener noreferrer">kaggle</a>, it contains almost 30.000 song. With features that describes how the song sounds (tempo, mode, etc). <br /><br />

          We use this data to make a song recommender that recommends songs similar to a song or the users song taste. We achieve this by using methods such as: <br />
          - Data analysis <br />
          - Elbow and Silhoutte method <br />
          - PCA Dimension Reduction Algorithm <br />
          - KMeans Clustering <br />
          - and Vector Similarity Function
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs