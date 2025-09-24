import { NextRequest, NextResponse } from 'next/server';

// 테스트용 webhook 응답 시뮬레이터 - Next.js API와 동일한 형태로 응답
export async function POST(request: NextRequest) {
  try {
    // FormData에서 파일 정보 로깅 (디버깅용)
    const formData = await request.formData();
    const file = formData.get('image') as File;

    console.log('Test webhook received file:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    });

    // 새로운 상세 분석 JSON 구조 반환 (Next.js API와 동일한 형태)
    const detailedResponse = [
      {
        "output": {
          "success": true,
          "data": {
            "overall_description": "제공해주신 이미지는 전형적인 한국식 인스턴트 라면(Ramyeon)입니다. 특히 신선한 계란 노른자가 중앙에 예쁘게 놓여 있어 먹음직스러움을 더하고 있으며, 함께 제공된 김치는 한국 음식임을 더욱 명확하게 보여줍니다.",
            "main_ingredients_analysis": {
              "side_dish_ingredients": "절인 배추, 고춧가루, 마늘, 생강, 파, 젓갈 등으로 만들어진 발효 식품.",
              "additional_toppings_ingredients": {
                "egg_yolk": "신선한 닭걀의 노른자 부분.",
                "green_onion": "신선한 채소."
              },
              "soup_ingredients": "고춧가루, 소금, 설탕, 간장 분말, 향신료, 다시마 추출물, L-글루탐산나트륨(MSG) 등 다양한 조미료와 향신료가 혼합된 분말 수프입니다.",
              "noodle_ingredients": "밀가루, 전분, 팜유 등을 주원료로 하며, 유탕 처리된 면입니다.",
              "dried_flakes_ingredients": "건조 대파, 건조 당근, 건조 버섯, 건조 양배추 등."
            },
            "nutrient_analysis": {
              "sodium": "라면 수프에 다량 함유되어 있어, 나트륨 섭취량이 매우 높을 수 있습니다. 이는 고혈압 등 건강에 영향을 줄 수 있으므로 국물을 전부 섭취하는 것은 권장되지 않습니다.",
              "proteins": "계란 노른자는 양질의 단백질 공급원이며, 면에도 소량의 단백질이 포함되어 있습니다. (계란 노른자로 보충)",
              "carbohydrates": "면에서 주로 공급되며, 빠른 에너지원이 됩니다. (주요 공급원)",
              "vitamins_minerals": {
                "kimchi": "비타민 C, 유산균(프로바이오틱스), 식이섬유, 칼슘, 철분 등.",
                "green_onion": "비타민 K, 비타민 C, 소량의 식이섬유.",
                "egg_yolk": "비타민 A, D, E, K, B군 비타민(특히 비타민 B12), 철분, 인, 아연 등 다양한 영양소가 풍부합니다.",
                "dried_flakes": "소량의 비타민과 미네랄, 식이섬유."
              },
              "fats": "면을 튀기는 데 사용되는 팜유 등에서 상당량 함유되어 있으며, 계란 노른자에도 지방이 풍부합니다. (주요 공급원)"
            },
            "overall_analysis": "이 라면은 빠르고 간편하게 즐길 수 있는 식사로, 특히 한국에서 많은 사랑을 받는 음식입니다. 매콤하고 감칠맛 나는 국물과 쫄깃한 면발, 그리고 부드러운 노른자가 조화를 이루어 맛과 영양을 더합니다. 김치와 함께 곁들이면 더욱 풍부한 맛을 즐길 수 있습니다. 다만, 높은 나트륨 함량에 유의하여 국물을 전부 마시는 것보다는 적당히 섭취하는 것이 건강에 좋습니다.",
            "food_type_and_characteristics": {
              "characteristics": {
                "soup": "붉은색을 띠는 매콤한 국물로, 한국 라면 특유의 얼큰하고 감칠맛 나는 양념이 특징입니다.",
                "noodle": "꼬불꼬불한 유탕면으로, 탄수화물이 풍부하고 쫄깃한 식감을 가집니다.",
                "toppings": {
                  "egg_yolk": "신선한 날것의 노른자가 중앙에 놓여 있어, 뜨거운 국물에 살짝 익히거나 터뜨려 국물과 섞어 부드러운 맛을 더할 수 있습니다. 양질의 단백질과 지방을 보충해줍니다.",
                  "green_onion": "얇게 썰린 초록색 파가 보여 풍미를 더하고 시각적으로도 신선함을 줍니다.",
                  "dried_flakes": "라면 봉지에 포함된 건조 채소 플레이크(파, 당근, 버섯, 양배추 등)가 면 사이사이에 보입니다."
                },
                "side_dish": "작은 접시에 붉은 양념의 김치가 놓여 있어, 매콤한 라면과 함께 먹기 좋은 한국인의 대표 반찬임을 알 수 있습니다."
              },
              "food_name": "한국식 인스턴트 라면 (Ramyeon)"
            },
            "calorie_estimation": {
              "notes": "(곁들여지는 김치의 칼로리는 별도이며, 라면 한 그릇의 칼로리에는 포함되지 않습니다.)",
              "total_estimated_calories": "500 kcal ~ 600 kcal",
              "instant_ramen_per_serving": "450 kcal ~ 550 kcal",
              "egg_yolk_per_item": "약 50 kcal ~ 60 kcal"
            }
          }
        }
      }
    ];

    // 실제 AI 분석 시간을 시뮬레이션하기 위한 지연
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Test webhook returning detailed analysis data');

    // Next.js API와 동일한 형태로 응답
    return NextResponse.json({
      success: true,
      data: detailedResponse,
      message: 'Test analysis completed successfully'
    });

  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      { error: 'Test webhook failed', message: error instanceof Error ? error.message : 'Unknown error' },
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
