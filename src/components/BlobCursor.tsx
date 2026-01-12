"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import styles from './blob.module.css';

interface TrailBlob {
    id: number;
    x: number;
    y: number;
    size: number;
}

export default function BlobCursor() {
    const mouseX = useMotionValue(-500);
    const mouseY = useMotionValue(-500);

    // Smooth lag for main blob
    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const [trails, setTrails] = useState<TrailBlob[]>([]);
    const trailId = useRef(0);
    const lastPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;
            const speed = Math.sqrt(dx * dx + dy * dy);

            if (speed > 10) {
                const id = trailId.current++;
                const newTrail = {
                    id,
                    x: e.clientX,
                    y: e.clientY,
                    size: Math.min(80, speed * 0.4 + 20)
                };
                setTrails(prev => [...prev.slice(-8), newTrail]);
                setTimeout(() => {
                    setTrails(prev => prev.filter(t => t.id !== id));
                }, 500);
            }
            lastPos.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className={styles.container}>
            <svg className={styles.hiddenSvg}>
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
                    </filter>
                </defs>
            </svg>

            <div className={styles.blobLayer} style={{ filter: 'url(#goo)' }}>
                {/* Main Blob */}
                <motion.div
                    className={styles.mainBlob}
                    style={{
                        x: smoothX,
                        y: smoothY,
                        translateX: '-50%',
                        translateY: '-50%',
                    }}
                />

                {/* Trails */}
                <AnimatePresence>
                    {trails.map((t) => (
                        <motion.div
                            key={t.id}
                            className={styles.trailBlob}
                            initial={{ scale: 1, opacity: 0.6, x: t.x, y: t.y }}
                            animate={{ scale: 0, opacity: 0, x: t.x, y: t.y }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            style={{
                                width: t.size,
                                height: t.size,
                                translateX: '-50%',
                                translateY: '-50%',
                            }}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
