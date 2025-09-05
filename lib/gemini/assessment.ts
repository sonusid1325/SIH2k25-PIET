interface UserProfile {
  displayName: string;
  age: number;
  course: string;
  stream: string;
  interests: string[];
  location: string;
}

interface AssessmentQuestion {
  id: string;
  type: 'mcq' | 'text' | 'scale' | 'multi-select';
  category: string;
  question: string;
  options?: string[];
  placeholder?: string;
  required: boolean;
  scaleRange?: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  };
}

interface AssessmentResponse {
  title: string;
  description: string;
  estimatedTime: number;
  questions: AssessmentQuestion[];
}

export async function generateAssessmentQuestions(userProfile: UserProfile): Promise<AssessmentResponse> {
  const prompt = `
You are an expert career counselor creating a personalized career assessment for a student. Based on their profile, generate a comprehensive assessment with 15-20 questions.

Student Profile:
- Name: ${userProfile.displayName}
- Age: ${userProfile.age}
- Current Status: ${userProfile.course}
- Stream/Field: ${userProfile.stream}
- Interests: ${userProfile.interests.join(', ')}
- Location: ${userProfile.location}

Create questions that cover:
1. Academic preferences and strengths
2. Work environment preferences
3. Personality traits and soft skills
4. Career aspirations and goals
5. Practical considerations (salary, work-life balance, etc.)
6. Specific questions based on their current educational status
7. Questions related to their stated interests

Mix different question types:
- Multiple choice (mcq)
- Text responses (text)
- Rating scales (scale)
- Multi-select options (multi-select)

Return ONLY a JSON object in this exact format:
{
  "title": "Personalized Career Assessment",
  "description": "A tailored assessment to discover your ideal career path based on your profile and preferences",
  "estimatedTime": 15,
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "category": "Academic Preferences",
      "question": "Which type of subjects do you find most engaging?",
      "options": ["Mathematics and Logic", "Languages and Literature", "Science and Research", "Arts and Creativity"],
      "required": true
    },
    {
      "id": "q2",
      "type": "text",
      "category": "Career Goals",
      "question": "Describe your ideal work environment in 2-3 sentences.",
      "placeholder": "E.g., I prefer working in teams, outdoor settings, creative spaces...",
      "required": true
    },
    {
      "id": "q3",
      "type": "scale",
      "category": "Work Preferences",
      "question": "How important is work-life balance to you?",
      "scaleRange": {
        "min": 1,
        "max": 10,
        "minLabel": "Not Important",
        "maxLabel": "Very Important"
      },
      "required": true
    }
  ]
}

Make sure:
- Questions are specific to their educational level and interests
- Include both general career questions and ones specific to their field
- Questions help identify suitable career paths in their area of study
- Mix of question types for comprehensive assessment
- All questions are clear and actionable for career guidance
`;

  try {
    const response = await fetch('/api/gemini/assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        userProfile,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate assessment questions');
    }

    const data = await response.json();
    return data.assessment;
  } catch (error) {
    console.error('Error generating assessment questions:', error);
    // Fallback with default questions
    return getDefaultAssessment();
  }
}

export async function analyzeAssessmentResponses(
  userProfile: UserProfile,
  responses: Record<string, any>
): Promise<any> {
  const prompt = `
You are an expert career counselor. Analyze this student's profile and assessment responses to provide personalized career guidance.

Student Profile:
- Name: ${userProfile.displayName}
- Age: ${userProfile.age}
- Current Status: ${userProfile.course}
- Stream/Field: ${userProfile.stream}
- Interests: ${userProfile.interests.join(', ')}
- Location: ${userProfile.location}

Assessment Responses:
${JSON.stringify(responses, null, 2)}

Provide comprehensive career guidance in this JSON format:
{
  "overallAnalysis": "Detailed analysis of their personality, strengths, and career fit based on responses",
  "recommendedCareers": [
    {
      "title": "Software Engineer",
      "match": 95,
      "description": "Why this career fits them",
      "growthPath": "Career progression path",
      "averageSalary": "₹8-25 LPA",
      "keySkills": ["Programming", "Problem Solving", "Logical Thinking"],
      "educationPath": "Recommended courses/degrees"
    }
  ],
  "courseRecommendations": [
    {
      "course": "B.Tech Computer Science",
      "institution": "IIT/NIT/Top Engineering Colleges",
      "duration": "4 years",
      "eligibility": "Requirements",
      "careerOutcomes": ["Software Developer", "Data Scientist", "Product Manager"]
    }
  ],
  "skillDevelopment": [
    "Programming Languages (Python, Java)",
    "Data Analysis",
    "Communication Skills"
  ],
  "actionPlan": [
    {
      "timeline": "Next 3 months",
      "actions": ["Specific actionable steps"]
    },
    {
      "timeline": "6-12 months",
      "actions": ["Medium-term goals"]
    },
    {
      "timeline": "1-2 years",
      "actions": ["Long-term objectives"]
    }
  ],
  "scholarships": [
    "Relevant scholarship opportunities based on their profile"
  ],
  "resources": [
    "Recommended books, courses, websites, and other resources"
  ]
}

Make recommendations specific to:
- Their current educational level
- Available colleges/courses in India (especially government colleges)
- Realistic career paths in Indian job market
- Their stated interests and assessment responses
- Location-specific opportunities if relevant
`;

  try {
    const response = await fetch('/api/gemini/analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        userProfile,
        responses,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze assessment responses');
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error('Error analyzing assessment responses:', error);
    throw error;
  }
}

function getDefaultAssessment(): AssessmentResponse {
  return {
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
      },
      {
        id: "q4",
        type: "mcq",
        category: "Personality",
        question: "You prefer to work:",
        options: ["Alone", "In small groups", "In large teams", "Varies by project"],
        required: true
      },
      {
        id: "q5",
        type: "multi-select",
        category: "Skills",
        question: "Which skills do you want to develop further? (Select all that apply)",
        options: ["Technical Skills", "Leadership", "Communication", "Creative Skills", "Analytical Thinking", "Problem Solving"],
        required: true
      }
    ]
  };
}
