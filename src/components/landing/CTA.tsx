'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

export function CTA() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="relative text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden p-10 sm:p-14"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-20"></div>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              지금 바로 시작하세요
            </h2>
            <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
              더 이상 식단 기록을 미루지 마세요. 사진 한 장으로 건강한 식습관을
              만들 수 있습니다.
            </p>
            <div className="mt-8">
              <Link
                href="/upload"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-bold text-blue-600 bg-white hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105"
              >
                <Camera className="w-6 h-6" />첫 식단 기록하기
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
