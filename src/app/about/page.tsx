import styles from './about.module.css';

export default function About() {
    return (
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className="container">
                    <h1>EXECUTING FOR THE <br />MODERN ERA.</h1>
                    <p className={styles.lead}>
                        HIGHP HAUS WAS BORN FROM A SIMPLE OBSERVATION: MOST AGENCIES ARE EITHER TOO CREATIVE TO BE TECHNICAL, OR TOO TECHNICAL TO BE CREATIVE. WE BRIDGE THAT GAP.
                    </p>
                </div>
            </section>

            <section className={styles.story}>
                <div className="container">
                    <div className={styles.content}>
                        <h2>EXECUTION & VERSATILITY</h2>
                        <div className={styles.textStack}>
                            <p>
                                WE DON'T JUST "ADVISE" OR "CONSULT." WE BUILD. WHETHER IT'S A HIGH-PERFORMANCE WEB3 APPLICATION, A VIRAL INSTAGRAM CONTENT SYSTEM, OR A GLOBAL MEDIA CAMPAIGN, OUR FOCUS IS ON THE OUTPUT.
                            </p>
                            <br />
                            <p>
                                WE WORK WITH STARTUPS, CREATORS, AND ESTABLISHED BUSINESSES WHO NEED A TEAM THAT UNDERSTANDS THE VELOCITY OF THE INTERNET TODAY. NO FAKE AWARD CLAIMS, NO BLOATED TEAMS—JUST PURE EXECUTION.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
