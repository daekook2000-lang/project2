'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database.types';

type FoodLog = Database['public']['Tables']['food_logs']['Row'] & {
  food_items: (Database['public']['Tables']['food_items']['Row'] & {
    nutrients: Database['public']['Tables']['nutrients']['Row'] | null;
  })[];
};

export function useDashboardData(
  userId: string,
  selectedDate: Date,
  initialFoodLogs: FoodLog[],
) {
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>(initialFoodLogs);
  const [loading, setLoading] = useState(false); // 초기 데이터가 있으므로 기본값은 false
  const [error, setError] = useState<string | null>(null);

  const fetchFoodLogs = useCallback(async (date: Date) => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('food_logs')
        .select(
          `
            *,
            food_items (
              *,
              nutrients (*)
            )
          `,
        )
        .eq('user_id', userId)
        .gte('logged_at', startOfDay.toISOString())
        .lte('logged_at', endOfDay.toISOString())
        .order('logged_at', { ascending: false });

      if (error) throw error;

      setFoodLogs(data || []);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // initialFoodLogs는 서버에서 첫 로드에만 사용됩니다.
    // 날짜가 변경될 때만 데이터를 다시 가져옵니다.
    // (컴포넌트가 처음 마운트될 때는 fetch를 건너뜁니다.)
    const isInitialDate =
      selectedDate.toDateString() === new Date().toDateString();

    if (!isInitialDate) {
      fetchFoodLogs(selectedDate);
    } else {
      setFoodLogs(initialFoodLogs);
    }
  }, [selectedDate, fetchFoodLogs, initialFoodLogs]);

  // 끼니별로 그룹화
  const groupedByMeal = foodLogs.reduce(
    (acc, log) => {
      const mealType = log.meal_type as '아침' | '점심' | '저녁' | '간식';
      if (!acc[mealType]) {
        acc[mealType] = [];
      }
      acc[mealType].push(log);
      return acc;
    },
    {} as Record<string, FoodLog[]>,
  );

  return {
    foodLogs,
    groupedByMeal,
    loading,
    error,
  };
}
