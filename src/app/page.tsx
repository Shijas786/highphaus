"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';

const SECTIONS = [
    {
        id: "hero",
        title: "HIGHP HAUS",
        subtitle: "Digital Built Different",
        desc: "Design · Development · Marketing · Media · Web3",
        video: "https://cdn.pixabay.com/video/2023/10/22/186105-877402660_large.mp4", // High fashion/artistic placeholder
    },
    {
        id: "build",
        title: "BUILD & TECH",
        desc: "Websites. Apps. Web3. Built to perform.",
        video: "https://cdn.pixabay.com/video/2020/05/25/40111-424754562_large.mp4",
    },
    {
        id: "design",
        title: "DESIGN & BRAND",
        desc: "Visual systems that actually work.",
        video: "https://cdn.pixabay.com/video/2021/08/04/83901-584742459_large.mp4",
    },
    {
        id: "marketing",
        title: "MARKETING & GROWTH",
        desc: "Attention is useless without results.",
        video: "https://cdn.pixabay.com/video/2020/09/20/50531-462111082_large.mp4",
    },
    {
        id: "media",
        title: "MEDIA PRODUCTION",
        desc: "Content that earns attention.",
        video: "https://cdn.pixabay.com/video/2023/04/16/159158-818224536_large.mp4",
    }
];

export default function Home() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <main className={styles.main}>
            <div className={styles.snapContainer}>
                {SECTIONS.map((section, index) => (
                    <section key={section.id} className={styles.section}>
                        <div className={styles.bgWrapper}>
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className={styles.bgImage} // Reuse the styling for full-bleed
                                style={{ filter: 'grayscale(100%) brightness(0.8)' }}
                            >
                                <source src={section.video} type="video/mp4" />
                            </video>
                        </div>

                        <div className={styles.overlay}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className={styles.contentBox}
                            >
                                {index === 0 ? (
                                    <>
                                        <h1 className={styles.heroTitle}>{section.title}</h1>
                                        <p className={styles.title}>{section.subtitle}</p>
                                    </>
                                ) : (
                                    <h2 className={styles.title}>{section.title}</h2>
                                )}
                                <p className={styles.description}>{section.desc}</p>
                                <Link href="/contact" className={styles.ctaButton}>
                                    View Collection
                                </Link>
                            </motion.div>
                        </div>

                        <div className={styles.footerInfo}>
                            <span className={styles.label}>
                                {index + 1} / {SECTIONS.length}
                            </span>
                        </div>
                    </section>
                ))}

                {/* Vertical Collection Grid - Like Zara's product lists */}
                <section className={styles.section}>
                    <div className={styles.horizontalScroll}>
                        {[1, 2].map((item) => (
                            <div key={item} className={styles.scrollItem}>
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className={styles.bgImage}
                                    style={{ filter: 'grayscale(100%) contrast(1.2)' }}
                                >
                                    <source src={item === 1 ? "https://cdn.pixabay.com/video/2023/03/05/153401-805404554_large.mp4" : "https://cdn.pixabay.com/video/2021/04/12/70860-536962295_large.mp4"} type="video/mp4" />
                                </video>
                                <div className={styles.overlay}>
                                    <span className={styles.title}>PROJECT 0{item}</span>
                                    <span className={styles.description}>Editorial / Digital</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className={styles.section} style={{ background: '#000', color: '#fff' }}>
                    <div className={styles.overlay} style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <h2 className={styles.heroTitle} style={{ color: '#fff' }}>JOIN THE MOVEMENT</h2>
                        <Link href="/contact" className={styles.ctaButton} style={{ borderColor: '#fff', color: '#fff' }}>
                            START A PROJECT
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
