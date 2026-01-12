import Link from 'next/link';
import styles from './footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} HIGHP HAUS</p>
                    <div className={styles.socials}>
                        <a href="#">INSTAGRAM</a>
                        <a href="#">TWITTER</a>
                        <a href="#">LINKEDIN</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
