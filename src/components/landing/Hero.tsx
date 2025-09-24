'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Camera } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-blue-50/50 to-background pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
            사진 한 장으로 끝내는,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              가장 쉬운 식단 기록
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
            AI가 음식 사진을 분석하여 칼로리와 영양 정보를 자동으로 계산하고
            기록합니다. 귀찮은 수동 입력은 이제 그만하세요.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/upload"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105"
          >
            <Camera className="w-5 h-5" />
            바로 시작하기
          </Link>
          <Link
            href="#features"
            className="group inline-flex items-center justify-center gap-1 px-6 py-3 rounded-full text-base font-bold text-foreground bg-secondary hover:bg-secondary/80 transition-colors transform hover:scale-105"
          >
            기능 더 알아보기
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
