"use client";
import React, { useState } from 'react';
import styles from './contact.module.css';

export default function Contact() {
    return (
        <main className={styles.main}>
            <section className="container">
                <div className={styles.grid}>
                    <div className={styles.info}>
                        <h1>LET'S <br />TALK.</h1>
                        <p>HAVE A PROJECT IN MIND? FILL OUT THE FORM OR REACH OUT DIRECTLY.</p>

                        <div className={styles.quickContact}>
                            <a href="mailto:hello@highphaus.com" className={styles.contactLink}>HELLO@HIGHPHAUS.COM</a>
                            <a href="https://wa.me/yourphone" className={styles.contactLink}>WHATSAPP INQUIRY</a>
                        </div>
                    </div>

                    <form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>NAME</label>
                            <input type="text" placeholder="NAME" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>EMAIL</label>
                            <input type="email" placeholder="EMAIL" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>SERVICE</label>
                            <select>
                                <option value="build">BUILD & TECH</option>
                                <option value="design">DESIGN & BRAND</option>
                                <option value="marketing">MARKETING & GROWTH</option>
                                <option value="media">MEDIA PRODUCTION</option>
                                <option value="web3">WEB3 & BLOCKCHAIN</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>MESSAGE</label>
                            <textarea placeholder="TELL US ABOUT YOUR PROJECT..." rows={5}></textarea>
                        </div>

                        <button type="submit" className={styles.submitBtn}>SEND MESSAGE</button>
                    </form>
                </div>
            </section>
        </main>
    );
}
