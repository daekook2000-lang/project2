import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/types/database.types';

type FoodLogWithDetails = Database['public']['Tables']['food_logs']['Row'] & {
  food_items: (Database['public']['Tables']['food_items']['Row'] & {
    nutrients: Database['public']['Tables']['nutrients']['Row'] | null;
  })[];
};

export async function getFoodLogsByDate(
  userId: string,
  date: Date,
): Promise<FoodLogWithDetails[]> {
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
    .order('logged_at', { ascending: true });

  if (error) {
    console.error('Error fetching food logs:', error);
    throw new Error('Could not fetch food log data.');
  }

  // Supabase 타입 이슈로 인한 any 캐스팅. 실제 데이터 구조는 FoodLogWithDetails[]와 일치해야 합니다.
  return data as any;
}
