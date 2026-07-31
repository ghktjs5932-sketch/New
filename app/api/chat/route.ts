import OpenAI from "openai";

export const maxDuration = 30;

export async function POST(req: Request) {
  // 클라이언트를 요청 시점에 생성 → 빌드 타임에 환경 변수 없어도 오류 없음
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.", { status: 500 });
  }

  const client = new OpenAI({ apiKey });

  try {
    const { messages } = await req.json();

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        {
          role: "system",
          content: `너는 친절하고 유쾌한 오락실(Arcade) 테마의 인공지능 수학 튜터야. 
학생이 일차부등식이나 수학 문제를 질문하면 친절하고 재미있게 단계별로 설명해줘. 
정답만 바로 알려주기보다는, 힌트를 통해 스스로 생각할 수 있도록 유도해봐. 
이모지를 적절히 사용하고, 학생을 칭찬하고 격려하는 밝은 에너지를 보여줘!
수식은 기호를 활용해서 보기 쉽게 표현해줘.`,
        },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return new Response("AI 서버 오류가 발생했습니다.", { status: 500 });
  }
}
