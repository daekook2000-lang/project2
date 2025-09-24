import { NextRequest, NextResponse } from 'next/server';

// 테스트용 webhook 응답 시뮬레이터
export async function POST(request: NextRequest) {
  try {
    // 실제 webhook이 반환할 것과 같은 형태의 응답 생성
    const mockResponse = [
      {
        "output": {
          "success": true,
          "data": {
            "items": [
              {
                "foodName": "그릴 치킨 샐러드 (Grilled Chicken Salad)",
                "confidence": 0.95,
                "quantity": "1 serving",
                "calories": 375,
                "nutrients": {
                  "carbohydrates": {
                    "value": 20,
                    "unit": "g"
                  },
                  "protein": {
                    "value": 35,
                    "unit": "g"
                  },
                  "fat": {
                    "value": 15,
                    "unit": "g"
                  },
                  "sugars": {
                    "value": 5,
                    "unit": "g"
                  },
                  "sodium": {
                    "value": 300,
                    "unit": "mg"
                  }
                }
              }
            ],
            "summary": {
              "totalCalories": 375,
              "totalCarbohydrates": {
                "value": 20,
                "unit": "g"
              },
              "totalProtein": {
                "value": 35,
                "unit": "g"
              },
              "totalFat": {
                "value": 15,
                "unit": "g"
              }
            }
          }
        }
      }
    ];

    // 실제 AI 분석 시간을 시뮬레이션하기 위한 지연
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      { error: 'Test webhook failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test Webhook Endpoint',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}
