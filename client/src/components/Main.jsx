import React, { useEffect, useState } from 'react'
import Song from './Song';
import Header from './Header';

const Main = () => {
  const [content, setContent] = useState("")
  const [option, setOption] = useState(1)

  /* -------------------- States for songRequest & Profile -------------------- */
  const [songName, setSongName] = useState("");
  const [songResponse, setSongResponse] = useState([]);

  const [songProfile, setSongProfile] = useState([])
  const addToProfile = (newSong) => {
      setSongProfile([...songProfile, newSong])
  }

  /* ---------------------------- Request Function ---------------------------- */
  const findSong = () => {
      const data = {songName:songName, profile:songProfile};
      console.log(data)

      fetch('http://127.0.0.1:5000/search-songs', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) => {
          console.log('Success:', data);
          setSongResponse(data.data);
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  };

  useEffect(() => {findSong()}, [songName, songProfile])

  /* ----------------------------- Similar Request ---------------------------- */
  const [similarSong, setSimilarSongs] = useState(false);

  const requestSimilarSongs = (songID) => {
      const data = {songID:songID};
      console.log(data)

      fetch('http://127.0.0.1:5000/similar-songs', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) => {
          console.log('Success:', data);
          setSimilarSongs(data.data); 
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  };

  const requestPlaylist = () => {
      const data = {profile:songProfile}
      console.log(data)

      fetch('http://127.0.0.1:5000/generate-playlist', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) => {
          console.log('Success:', data);
          setSimilarSongs(data.data); 
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  };

  /* ----------------------- Song Query Response Manager ---------------------- */
  useEffect(() => {
    if(!similarSong && songResponse){
      setContent(
        songResponse.map((s) => (
          option === 1 ?
          <Song songName={s[0]} artistName={s[1]} hover={true}
          onClickDoThis={() => {requestSimilarSongs(s[2])}} width={'w-1/2'}/>
          :
          <Song songName={s[0]} artistName={s[1]} hover={true}
          onClickDoThis={() => {addToProfile(s)}} width={'w-1/2'}/>
        ))
      )
    }
  }, [option, songResponse, similarSong])

  useEffect(() => {
    if(similarSong){
      setContent(
        <>
          <button
            className='raleway text-white text-xl font-bold flex gap-3 items-center mb-3 bg-green-800 px-5 py-2 rounded-2xl hover:opacity-90'
            onClick={() => {setSimilarSongs(false)}}
          >
            <img className='w-6' src="assets/reset.png" alt="" />
            <div>Reset</div>
          </button>

          {similarSong.map((s) => (
            <Song songName={s[0]} artistName={s[1]} width={'min-w-[50%]'}/>
          ))}
        </>
      )
    }
  }, [similarSong])

  /* ----------------------------- Profile Manager ---------------------------- */
  const [profile, setProfile] = useState("")

  const deleteSong = (index) => {
    songProfile.splice(index, 1); // Remove the item at the given index
    setProfile( // Update the state to re-render
      songProfile.map((s, i) => (
        <Song
          key={i}
          songName={s[0]}
          artistName={s[1]}
          deleteable={true}
          width={'w-full'}
          onClickDoThis={() => deleteSong(i)} // Pass delete function with index
        />
      ))
    );
  };

  useEffect(() => {
    if(songProfile){
      setProfile(
        songProfile.map((s, i) => (
          <Song key={i} songName={s[0]} artistName={s[1]} deleteable={true} width={'w-full'} onClickDoThis={() => deleteSong(i)}/>
        ))
      )
    }
  }, [songProfile])

  /* ------------------------------ Main Content ------------------------------ */
  return (
    <div className='bg-[#141414]'>
      <Header />
      <main className='raleway px-10 flex gap-3 min-h-[650px] pb-10'>
        <div className='w-1/3 flex flex-col gap-3'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl text-white font-bold'>Your Song Playlist</h1>

            <button className='bg-[#1EE062] px-4 py-2 text-xl font-semibold flex gap-3 rounded-full' onClick={() => {requestPlaylist()}}>
              <img className='w-5' src="assets/star.png" alt=""/>
              Generate
            </button>
          </div>

          <div className='p-5 gap-8 bg-[#1C1C1C] h-full rounded-lg'>
            {profile}
          </div>
        </div>

        <div className='w-2/3 flex flex-col gap-3'>
          <div className='w-full h-11'></div>

          <div className='text-white flex gap-5'>
            <input className='w-2/3 text-white bg-[#3C3C3C] font-semibold px-5 py-4 rounded-full' type="text" placeholder='Find a song here' onChange={(e) => {setSongName(e.target.value)}}/>

            <div className='flex justify-between font-bold w-1/3'>
              <button
                className={`hover:text-[#1EE062] hover:underline transition-all ease-in-out ${option === 1 ? 'text-[#1EE062] underline' : ''}`}
                onClick={() => {setOption(1)}}
              >
                Find Similar Songs
              </button>

              <div className='flex items-center'>
                <img className='h-5' src="assets/divider.png" alt="" />
              </div>

              <button
                className={`hover:text-[#1EE062] hover:underline transition-all ease-in-out ${option === 2 ? 'text-[#1EE062] underline' : ''}`}
                onClick={() => {setOption(2)}}
              >
                Add to Playlist
              </button>
            </div>
          </div>

          <div className='bg-[#1C1C1C] px-10 py-6 h-full rounded-lg'>
            {content}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Main