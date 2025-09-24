import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { WebhookResponse, FoodLogEntry } from '@/lib/types/ai-analysis.types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received webhook payload:', JSON.stringify(body, null, 2));

    // webhook 응답이 배열 형태로 오는 경우 처리
    const webhookData: WebhookResponse[] = Array.isArray(body) ? body : [body];
    
    if (!webhookData || webhookData.length === 0) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    const firstResponse = webhookData[0];
    
    if (!firstResponse.output || !firstResponse.output.success) {
      return NextResponse.json(
        { error: 'Analysis failed', data: firstResponse.output },
        { status: 400 }
      );
    }

    const analysisData = firstResponse.output.data;
    
    // 요청 헤더에서 사용자 정보나 세션 정보를 가져올 수 있도록 준비
    const userId = request.headers.get('x-user-id');
    const imageUrl = request.headers.get('x-image-url');
    const mealType = (request.headers.get('x-meal-type') as 'breakfast' | 'lunch' | 'dinner' | 'snack') || 'snack';

    if (!userId || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required headers: x-user-id, x-image-url' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // 분석된 각 음식 아이템을 데이터베이스에 저장
    const foodLogEntries: Omit<FoodLogEntry, 'id' | 'created_at' | 'updated_at'>[] = 
      analysisData.items.map(item => ({
        user_id: userId,
        image_url: imageUrl,
        food_name: item.foodName,
        quantity: item.quantity,
        calories: item.calories,
        carbohydrates: item.nutrients.carbohydrates.value,
        protein: item.nutrients.protein.value,
        fat: item.nutrients.fat.value,
        sugars: item.nutrients.sugars.value,
        sodium: item.nutrients.sodium.value,
        confidence: item.confidence,
        meal_type: mealType,
        logged_at: new Date().toISOString()
      }));

    const { data: insertedData, error: insertError } = await supabase
      .from('food_logs')
      .insert(foodLogEntries)
      .select();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save analysis results', details: insertError.message },
        { status: 500 }
      );
    }

    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      message: 'Analysis results saved successfully',
      data: {
        analysisResult: analysisData,
        savedEntries: insertedData
      }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET 메서드로 webhook 엔드포인트 테스트 가능
export async function GET() {
  return NextResponse.json({
    message: 'AI Analysis Webhook Endpoint',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}
