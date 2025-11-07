'use client';

import { motion } from 'framer-motion';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <motion.footer
      className="relative z-10 mt-auto border-t border-baseBlue/20 bg-darkBg/50 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-baseBlue to-baseCyan"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
            <div>
              <p className="text-sm font-semibold text-white">Base Faucet</p>
              <p className="text-xs text-gray-400">Powered by WalletConnect v4</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-baseBlue transition-colors"
            >
              About Base
            </a>
            <a
              href="https://docs.base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-baseBlue transition-colors"
            >
              Documentation
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-glass hover:bg-baseBlue/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="w-5 h-5 text-gray-400" />
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-glass hover:bg-baseCyan/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Twitter className="w-5 h-5 text-gray-400" />
            </motion.a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-baseBlue/10 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Base Faucet. Built with ❤️ for the Base community.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
