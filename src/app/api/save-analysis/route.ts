import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AnalysisData, FoodLogEntry, FoodItemEntry, NutrientEntry } from '@/lib/types/ai-analysis.types';

interface SaveAnalysisRequest {
  userId: string;
  imageUrl: string;
  analysisData: AnalysisData;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveAnalysisRequest = await request.json();

    if (!body.userId || !body.imageUrl || !body.analysisData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { userId, imageUrl, analysisData, mealType = 'snack' } = body;

    const supabase = createClient();

    // 1. 먼저 food_logs에 분석 세션 저장
    const mealTypeMapping = {
      'breakfast': '아침',
      'lunch': '점심',
      'dinner': '저녁',
      'snack': '간식'
    };

    const foodLogData: Omit<FoodLogEntry, 'id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      image_url: imageUrl,
      meal_type: mealTypeMapping[mealType],
      logged_at: new Date().toISOString(),
      analysis_status: 'completed',
      total_calories: analysisData.summary.totalCalories
    };

    const { data: foodLogResult, error: foodLogError } = await supabase
      .from('food_logs')
      .insert(foodLogData)
      .select()
      .single();

    if (foodLogError) {
      console.error('Food log insert error:', foodLogError);
      return NextResponse.json(
        { error: 'Failed to save food log', details: foodLogError.message },
        { status: 500 }
      );
    }

    // 2. 각 음식 아이템을 food_items에 저장
    const foodItems: Omit<FoodItemEntry, 'id' | 'created_at'>[] = analysisData.items.map(item => ({
      food_log_id: foodLogResult.id,
      food_name: item.foodName,
      confidence: item.confidence,
      quantity: item.quantity,
      calories: item.calories
    }));

    const { data: foodItemsResult, error: foodItemsError } = await supabase
      .from('food_items')
      .insert(foodItems)
      .select();

    if (foodItemsError) {
      console.error('Food items insert error:', foodItemsError);
      return NextResponse.json(
        { error: 'Failed to save food items', details: foodItemsError.message },
        { status: 500 }
      );
    }

    // 3. 각 음식의 영양소를 nutrients 테이블에 저장
    const nutrients: Omit<NutrientEntry, 'id' | 'created_at'>[] = [];

    analysisData.items.forEach((item, itemIndex) => {
      const foodItemId = foodItemsResult[itemIndex].id;

      // 탄수화물
      nutrients.push({
        food_item_id: foodItemId,
        nutrient_type: 'carbohydrates',
        value: item.nutrients.carbohydrates.value,
        unit: item.nutrients.carbohydrates.unit
      });

      // 단백질
      nutrients.push({
        food_item_id: foodItemId,
        nutrient_type: 'protein',
        value: item.nutrients.protein.value,
        unit: item.nutrients.protein.unit
      });

      // 지방
      nutrients.push({
        food_item_id: foodItemId,
        nutrient_type: 'fat',
        value: item.nutrients.fat.value,
        unit: item.nutrients.fat.unit
      });

      // 당류
      nutrients.push({
        food_item_id: foodItemId,
        nutrient_type: 'sugars',
        value: item.nutrients.sugars.value,
        unit: item.nutrients.sugars.unit
      });

      // 나트륨
      nutrients.push({
        food_item_id: foodItemId,
        nutrient_type: 'sodium',
        value: item.nutrients.sodium.value,
        unit: item.nutrients.sodium.unit
      });
    });

    const { error: nutrientsError } = await supabase
      .from('nutrients')
      .insert(nutrients);

    if (nutrientsError) {
      console.error('Nutrients insert error:', nutrientsError);
      return NextResponse.json(
        { error: 'Failed to save nutrients', details: nutrientsError.message },
        { status: 500 }
      );
    }

    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      message: 'Analysis results saved successfully',
      data: {
        foodLog: foodLogResult,
        foodItems: foodItemsResult,
        summary: analysisData.summary
      }
    });

  } catch (error) {
    console.error('Save analysis error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
