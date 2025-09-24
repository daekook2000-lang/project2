'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bot, Clock, Zap } from 'lucide-react';

const features = [
  {
    icon: <Bot className="w-8 h-8 text-white" />,
    title: 'AI 자동 분석',
    description: '사진을 올리면 AI가 자동으로 음식 종류, 칼로리, 영양성분을 분석하여 기록합니다.',
    bgColor: 'bg-blue-500',
  },
  {
    icon: <Clock className="w-8 h-8 text-white" />,
    title: '끼니 자동 분류',
    description: '업로드 시간을 기준으로 아침, 점심, 저녁, 간식으로 자동 분류되어 신경 쓸 필요가 없습니다.',
    bgColor: 'bg-purple-500',
  },
  {
    icon: <BarChart className="w-8 h-8 text-white" />,
    title: '영양 대시보드',
    description: '일별, 주별 섭취 칼로리와 영양 성분을 차트로 한눈에 파악하여 식습관을 관리할 수 있습니다.',
    bgColor: 'bg-green-500',
  },
  {
    icon: <Zap className="w-8 h-8 text-white" />,
    title: 'Frictionless Logging',
    description: '단 한 번의 사진 업로드로 모든 기록이 완료됩니다. 사용자의 추가 행동은 필요 없습니다.',
    bgColor: 'bg-yellow-500',
  },
];

const featureVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-foreground"
          >
            당신의 식단 관리를 혁신합니다
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            기존의 식단 관리 앱이 가진 불편함을 기술로 해결했습니다.
          </motion.p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={featureVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col p-6 border border-border rounded-2xl shadow-sm hover:shadow-lg transition-shadow bg-card"
            >
              <div className="flex-shrink-0">
                <div
                  className={`flex items-center justify-center h-14 w-14 rounded-xl ${feature.bgColor}`}
                >
                  {feature.icon}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-card-foreground">{feature.title}</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
