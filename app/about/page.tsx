'use client';
import React, { createContext } from 'react';
import { title } from '@/components/primitives';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <motion.div
            className="p-5 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className={title({ color: 'blue' })}>About</h1>
            <motion.p
                className="mb-5 leading-relaxed mt-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                NexShare is a leading provider of innovative solutions in the
                tech industry. Our mission is to deliver high-quality products
                that meet the needs of our customers. With a team of dedicated
                professionals, we strive to push the boundaries of technology
                and provide exceptional service.
            </motion.p>
            <motion.p
                className="leading-relaxed"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                Founded in 2010, NexShare has grown from a small startup to a
                global company with clients all over the world. Our core values
                include integrity, innovation, and customer satisfaction. We
                believe in creating a positive impact through our products and
                services.
            </motion.p>
        </motion.div>
    );
}
