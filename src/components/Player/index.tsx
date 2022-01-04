import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Image  from 'next/image'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { ImMusic } from 'react-icons/im';
import { FiRepeat } from 'react-icons/fi';
import { BsShuffle ,BsFillVolumeDownFill} from 'react-icons/bs';



export function Player(){
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const {episodeList,
            currentEpisodeIndex,
            isPlaying,
            tooglePlay,
            setPlayingState,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
            isLooping,
            toogleLoop,
            toogleShuffler,
            isShuffling,
            clearPlayState
            }= useContext(PlayerContext)
    useEffect(()=> {
        if(!audioRef.current){
            return
        }
        if(isPlaying){
            audioRef.current.play()
        }
        else{
            audioRef.current.pause()
        }
    },[isPlaying])    

    function setupProgressListener(){
        audioRef.current.currentTime=0;
        audioRef.current.addEventListener('timeupdate',()=>{
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }
    function handleSeek(amount:number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }
    function handleEpisodeNext(){
        if(hasNext){
            playNext();
        }else{
            clearPlayState();
        }
    }
    function IconMudeColorRepeat(){
        if(!isLooping){
            const iconMude = 'Black'
            return iconMude;
        }else{
            const iconMude = 'White'
            return iconMude;
        }
    }
    function IconMudeColorShuffler(){
        if(!isShuffling){
            const iconMude = 'Black'
            return iconMude;
        }else{
            const iconMude = 'White'
            return iconMude;
        }
    }
    const episode = episodeList[currentEpisodeIndex]

    return(
        <div className={styles.playerContainer}>
            <header>
                 <ImMusic size="2rem" color="white"/>
                <strong>Tocando agora</strong>
            </header>
            
                {episode? (
                    <div className={styles.currentEpisode}>
                        <Image src={episode?.thumbnail}
                        width={592} height={592} objectFit="cover"/>
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>

                    </div>
                ):(
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione uma música para ouvir </strong>
                    </div>
                    )}
            
            <footer  className={!episode?styles.empty:''}>
                <div className = {styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className ={styles.slider}>
                        { episode ? (
                            <Slider
                            // aqui vai o episode?.duration
                                max={30}
                                onChange={handleSeek}
                                value={progress}
                                trackStyle={{ backgroundColor:'#000'}}
                                railStyle={{backgroundColor:'#9f75ff'}}
                                handleStyle={{borderColor:'#000',borderWidth:4}}
                            />
                        ) : (
                            <div className = {styles.emptySlider}/>
                        )}
                    </div>
                    {// aqui vai o episode?.duration
                    }
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                
                {episode && (
                    <audio src={episode.url} 
                    autoPlay 
                    onEnded={handleEpisodeNext}
                    loop={isLooping}
                    ref={audioRef} 
                    onLoadedMetadata={setupProgressListener}
                    onPlay={()=>setPlayingState(true)} 
                    onPause={()=> setPlayingState(false)}/>
                )}

                <div className = {styles.buttons}>
                    <button type="button" disabled={!episode} onClick={toogleShuffler}>
                        <BsShuffle  size="1.3rem" color={IconMudeColorShuffler()} />
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="previous.png"  width="20px" height="20px" alt="Anterior"/>
                    </button>
                    <button type="button" disabled={!episode} onClick={tooglePlay}>
                        {isPlaying
                            ? <img src="pause.png" width="20px" height="20px" alt="Play"/>
                            : <img src="play.png" width="20px" height="20px" alt="Play"/>
                        }                       
                    </button>
                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="forward.png" width="20px" height="20px" alt="Proximo"/>
                    </button>
                    <button type="button" disabled={!episode} onClick={toogleLoop} >
                        <FiRepeat  size="1.3rem" color={IconMudeColorRepeat()} />
                    </button>
                </div>
            </footer>
        </div>
    );
}