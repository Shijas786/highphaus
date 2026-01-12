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
        img: "/hero_base_portrait.jpg",
    },
    {
        id: "build",
        title: "BUILD & TECH",
        desc: "Websites. Apps. Web3. Built to perform.",
        img: "/build_section.jpg",
    },
    {
        id: "design",
        title: "DESIGN & BRAND",
        desc: "Visual systems that actually work.",
        img: "/design_main.jpg",
    },
    {
        id: "marketing",
        title: "MARKETING & GROWTH",
        desc: "Attention is useless without results.",
        img: "/grow_main.jpg",
    },
    {
        id: "media",
        title: "MEDIA PRODUCTION",
        desc: "Content that earns attention.",
        img: "/produce_main.jpg",
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
                            <motion.img
                                initial={{ scale: 1.1 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                src={section.img}
                                alt={section.title}
                                className={styles.bgImage}
                            />
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
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className={styles.scrollItem}>
                                <img
                                    src={`/design_main.jpg`}
                                    className={styles.bgImage}
                                    alt="Product"
                                />
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
