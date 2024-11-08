'use client';
import React, { createContext } from 'react';
import { title } from '@/components/primitives';
import { motion } from 'framer-motion';

export default function ContactPage() {
    return (
        <motion.div
            className="p-5 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className={title({ color: 'blue' })}>Contact Us</h1>
            <motion.form
                className="flex flex-col"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="message" className="block mb-2">
                        Message:
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="p-3 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    Submit
                </button>
            </motion.form>
            <motion.div
                className="mt-5"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <p>You can also reach us at:</p>
                <p>Email: contact@nexshare.com</p>
                <p>Phone: (123) 456-7890</p>
            </motion.div>
        </motion.div>
    );
}
