import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, userProfile } = await request.json();

    if (!prompt || !userProfile) {
      return NextResponse.json(
        { error: 'Prompt and user profile are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate assessment questions' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { error: 'No content generated from Gemini' },
        { status: 500 }
      );
    }

    // Try to parse the JSON response
    try {
      // Clean the response text to extract JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const assessment = JSON.parse(jsonMatch[0]);

      // Validate the assessment structure
      if (!assessment.questions || !Array.isArray(assessment.questions)) {
        throw new Error('Invalid assessment structure');
      }

      return NextResponse.json({ assessment });
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Generated text:', generatedText);

      // Return a fallback assessment
      const fallbackAssessment = {
        title: "Career Assessment",
        description: "Discover your ideal career path through this comprehensive assessment",
        estimatedTime: 15,
        questions: [
          {
            id: "q1",
            type: "mcq",
            category: "Academic Preferences",
            question: "Which type of subjects do you find most engaging?",
            options: ["Mathematics and Logic", "Languages and Literature", "Science and Research", "Arts and Creativity"],
            required: true
          },
          {
            id: "q2",
            type: "text",
            category: "Career Goals",
            question: "Describe your ideal work environment in 2-3 sentences.",
            placeholder: "E.g., I prefer working in teams, outdoor settings, creative spaces...",
            required: true
          },
          {
            id: "q3",
            type: "scale",
            category: "Work Preferences",
            question: "How important is work-life balance to you?",
            scaleRange: {
              min: 1,
              max: 10,
              minLabel: "Not Important",
              maxLabel: "Very Important"
            },
            required: true
          }
        ]
      };

      return NextResponse.json({ assessment: fallbackAssessment });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
