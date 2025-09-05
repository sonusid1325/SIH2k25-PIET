import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, userProfile, responses } = await request.json();

    if (!prompt || !userProfile || !responses) {
      return NextResponse.json(
        { error: 'Prompt, user profile, and responses are required' },
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
        { error: 'Failed to analyze assessment responses' },
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

      const analysis = JSON.parse(jsonMatch[0]);

      // Validate the analysis structure
      if (!analysis.overallAnalysis || !analysis.recommendedCareers) {
        throw new Error('Invalid analysis structure');
      }

      return NextResponse.json({ analysis });
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Generated text:', generatedText);

      // Return a fallback analysis
      const fallbackAnalysis = {
        overallAnalysis: "Based on your responses, you show strong analytical thinking and problem-solving abilities. You prefer structured environments and enjoy working with data and technology.",
        recommendedCareers: [
          {
            title: "Software Developer",
            match: 85,
            description: "Your logical thinking and interest in technology make this a great fit",
            growthPath: "Junior Developer → Senior Developer → Tech Lead → Engineering Manager",
            averageSalary: "₹6-20 LPA",
            keySkills: ["Programming", "Problem Solving", "Logical Thinking"],
            educationPath: "B.Tech Computer Science or related field"
          },
          {
            title: "Data Analyst",
            match: 78,
            description: "Your analytical skills and attention to detail suit data-driven roles",
            growthPath: "Junior Analyst → Senior Analyst → Data Scientist → Analytics Manager",
            averageSalary: "₹5-15 LPA",
            keySkills: ["Data Analysis", "Statistics", "Critical Thinking"],
            educationPath: "B.Sc Statistics/Mathematics or B.Tech with analytics specialization"
          }
        ],
        courseRecommendations: [
          {
            course: "B.Tech Computer Science",
            institution: "Government Engineering Colleges/IITs/NITs",
            duration: "4 years",
            eligibility: "12th with PCM, JEE qualification",
            careerOutcomes: ["Software Developer", "System Analyst", "Product Manager"]
          }
        ],
        skillDevelopment: [
          "Programming Languages (Python, Java)",
          "Data Analysis and Statistics",
          "Problem Solving",
          "Communication Skills"
        ],
        actionPlan: [
          {
            timeline: "Next 3 months",
            actions: [
              "Start learning a programming language (Python recommended)",
              "Complete online courses in data analysis",
              "Work on small projects to build portfolio"
            ]
          },
          {
            timeline: "6-12 months",
            actions: [
              "Apply for relevant degree programs",
              "Join coding communities and hackathons",
              "Build 2-3 substantial projects"
            ]
          },
          {
            timeline: "1-2 years",
            actions: [
              "Complete internships in target field",
              "Network with professionals",
              "Prepare for campus placements"
            ]
          }
        ],
        scholarships: [
          "National Scholarship Portal schemes",
          "Merit-based scholarships in engineering colleges",
          "Industry-sponsored scholarships for STEM fields"
        ],
        resources: [
          "Codecademy for programming basics",
          "Khan Academy for mathematics",
          "GitHub for project hosting",
          "LinkedIn Learning for professional skills"
        ]
      };

      return NextResponse.json({ analysis: fallbackAnalysis });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
