import { GetStaticProps } from 'next'
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';
import  Image  from 'next/image'
import  {api} from '../services/api'
import { format, parseISO} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import styles from '../pages/home.module.scss'
import apideezer from '../services/apideezer';


export type Episode = {
    id: string;
    title:string;
    thumbnail: string;
  //  description:string
    duration:number;
    durationAsString:string;
    members:string;
    url:string;
  //  publishedAt: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}


export default function Home({latestEpisodes,allEpisodes}: HomeProps) {
  
  const {playList} = useContext(PlayerContext)
  const episodeList = [...latestEpisodes,...allEpisodes];

  return (
   <div className={styles.homepage}>
      
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
      
        <ul>{latestEpisodes.map((episode,index)=>{
          return(
            <li key={episode.id}>
              <Image width={80} height={80} src={episode.thumbnail}
              objectFit="cover"
              />
              <div className={styles.episodeDetails}>
                <a href="">{episode.title}</a>
                <p>{episode.members}</p>
               {// //<span>{episode.publishedAt}</span>
                }<span>{episode.durationAsString}</span>
              </div>

              <button type="button" onClick={()=>playList(episodeList,index)}>
                <Image src="/play2.png" width={30} height={30}/>
              </button>
            </li>
          )
        })}</ul>
      
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todas as músicas</h2>
        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Música</th>
            <th>Artista</th>
            <th>Duração</th>
            <th></th>
          </thead>
            <tbody>
              {allEpisodes.map((episode,index)=>{
                return(
                  <tr key={episode.id}>
                    <td>
                      <Image 
                        width={60}
                        height={60}
                        src={episode.thumbnail}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <a href="">{episode.title}</a>
                    </td>
                    <td>{episode.members}</td>
                    <td>{episode.durationAsString}</td>
                      
                  {//  <td>{episode.publishedAt}</td>             
                  //  
                }
                      
                      <button type="button" onClick={()=> playList(episodeList, index + latestEpisodes.length)}>
                        <img src="/play2.png" width="20px" height="20px"/>
                      </button>
                  </tr>
                )
              })}
            </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ()  =>{
const {data} = await apideezer.get('');
    /*
    'episodes',{
    params:{  
      _limit:12,
      //_sort:'published_at',
      //_order:'desc'
    }
  })*/
  console.log(data)
  const episodes = data.data.map(episode=>{
    return{
      id:episode.id,
      title:episode.title,
      thumbnail: episode.album.cover_xl,
      members:episode.artist.name,
    //  publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale:ptBR}),
      durationAsString: convertDurationToTimeString(episode.duration),
      duration: episode.duration,    
      url:episode.preview,
    }
  })
  const latestEpisodes = episodes.slice(0,2);
  const allEpisodes = episodes.slice(2,episodes.length);
  return{
    props:{
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}