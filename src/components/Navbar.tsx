import Link from 'next/link';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import styles from './navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <div className={styles.navInner}>
                <div className={styles.navLeft}>
                    <button className={styles.iconButton}>
                        <Menu size={24} strokeWidth={1} />
                    </button>
                    <div className={styles.searchBox}>
                        <Search size={18} strokeWidth={1} />
                        <span className={styles.searchText}>Search</span>
                    </div>
                </div>

                <Link href="/" className={styles.logo}>
                    HIGHP HAUS
                </Link>

                <div className={styles.navRight}>
                    <Link href="/about" className={styles.navLink}>HELP</Link>
                    <Link href="/contact" className={styles.navLink}>LOG IN</Link>
                    <button className={styles.iconButton}>
                        <ShoppingBag size={20} strokeWidth={1} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
