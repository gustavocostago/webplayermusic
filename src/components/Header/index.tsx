import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './styles.module.scss';

export function Header(){
    const currentDate = 
    format(new Date(), 'EEEE, d MMMM', {locale: ptBR});
    return(
        <header className={styles.headerContainer}>
            <img src="/logo2.png" width="50px" height="50px" alt="Podcastr"/>
            <h1>FreeMusic</h1>
            <p>O melhor para você ouvir, sempre!</p>
            <span>{currentDate}</span>
        </header>
    );
}