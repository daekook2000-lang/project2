'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, BrainCircuit, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: <Camera className="w-10 h-10 text-blue-600" />,
    title: '1. 사진 촬영 및 업로드',
    description: '관리하고 싶은 음식 사진을 찍거나 갤러리에서 선택하여 업로드합니다.',
  },
  {
    icon: <BrainCircuit className="w-10 h-10 text-purple-600" />,
    title: '2. AI 자동 분석',
    description: 'AI가 실시간으로 사진을 분석하여 음식의 종류, 칼로리, 영양 정보를 인식합니다.',
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-green-600" />,
    title: '3. 기록 확인',
    description: '분석된 결과가 대시보드에 자동으로 기록됩니다. 끼니도 자동으로 분류됩니다.',
  },
];

const stepVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-foreground"
          >
            정말 간편한 3단계 프로세스
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            "찍고, 올리면, 끝." 더 이상 설명이 필요 없습니다.
          </motion.p>
        </div>

        <div className="mt-12 relative">
          <div className="absolute left-1/2 top-10 bottom-10 w-px bg-border hidden md:block" aria-hidden="true"></div>
          
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center p-6 bg-card rounded-2xl shadow-md border border-border"
              >
                <div className="flex items-center justify-center h-20 w-20 mx-auto mb-5 bg-muted rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-card-foreground">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
