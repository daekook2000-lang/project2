'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAuth } from '../providers/Providers';

export function Header() {
  const { user, loading } = useAuth();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-sm border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CalorieAI
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">기능 소개</Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">사용 방법</Link>
          </nav>
          <div className="flex items-center">
            {!loading && (
              <>
                {user ? (
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    대시보드로 이동
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="group inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-foreground bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    로그인
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
