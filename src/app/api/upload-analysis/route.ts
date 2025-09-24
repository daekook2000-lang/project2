import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: image or userId' },
        { status: 400 }
      );
    }

    // 실제 n8n webhook URL
    const n8nWebhookUrl = 'https://daekook2000.app.n8n.cloud/webhook-test/62461ec8-1135-4c58-a9d0-0cfacd006298';

    console.log('Server: Forwarding to n8n webhook:', n8nWebhookUrl);
    console.log('Server: File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // n8n 웹훅으로 요청 전송
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 60000); // 60 seconds timeout

    try {
      const webhookResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('n8n webhook error:', {
          status: webhookResponse.status,
          statusText: webhookResponse.statusText,
          body: errorText
        });

        return NextResponse.json(
          { error: `n8n webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}` },
          { status: webhookResponse.status }
        );
      }

      const responseText = await webhookResponse.text();
      console.log('n8n webhook response received, length:', responseText.length);

      // JSON 파싱 시도
      let webhookData;
      try {
        webhookData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return NextResponse.json(
          { error: 'Invalid JSON response from n8n webhook', details: parseError },
          { status: 500 }
        );
      }

      // 성공 응답 반환
      return NextResponse.json({
        success: true,
        data: webhookData,
        message: 'Analysis completed successfully'
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);

      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - n8n webhook took too long to respond' },
          { status: 408 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to connect to n8n webhook', details: fetchError.message },
        { status: 502 }
      );
    }

  } catch (error) {
    console.error('Upload analysis error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
