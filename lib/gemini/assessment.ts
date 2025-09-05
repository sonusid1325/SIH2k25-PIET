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
  type: "mcq" | "text" | "scale" | "multi-select";
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

export async function generateAssessmentQuestions(
  userProfile: UserProfile,
): Promise<AssessmentResponse> {
  const prompt = `
You are an expert career counselor creating a personalized career assessment for a student. Based on their profile, generate a comprehensive assessment with 15-20 questions.

Student Profile:
- Name: ${userProfile.displayName}
- Age: ${userProfile.age}
- Current Status: ${userProfile.course}
- Stream/Field: ${userProfile.stream}
- Interests: ${userProfile.interests.join(", ")}
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
    const response = await fetch("/api/gemini/assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        userProfile,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate assessment questions");
    }

    const data = await response.json();
    return data.assessment;
  } catch (error) {
    console.error("Error generating assessment questions:", error);
    // Fallback with default questions
    return getDefaultAssessment();
  }
}

export async function analyzeAssessmentResponses(
  userProfile: UserProfile,
  responses: Record<string, unknown>,
): Promise<unknown> {
  const prompt = `
You are an expert career counselor. Analyze this student's profile and assessment responses to provide personalized career guidance.

Student Profile:
- Name: ${userProfile.displayName}
- Age: ${userProfile.age}
- Current Status: ${userProfile.course}
- Stream/Field: ${userProfile.stream}
- Interests: ${userProfile.interests.join(", ")}
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
    const response = await fetch("/api/gemini/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        userProfile,
        responses,
      }),
    });

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      const errorText = await response.text();
      console.error("API Error Response:", errorText);

      // Return fallback analysis instead of throwing error
      return getFallbackAnalysis(userProfile, responses);
    }

    const data = await response.json();

    if (!data.analysis) {
      console.error("No analysis in API response:", data);
      return getFallbackAnalysis(userProfile, responses);
    }

    return data.analysis;
  } catch (error) {
    console.error("Error analyzing assessment responses:", error);
    // Return fallback analysis instead of throwing error
    return getFallbackAnalysis(userProfile, responses);
  }
}

function getFallbackAnalysis(
  userProfile: UserProfile,
  responses: Record<string, unknown>,
) {
  // Generate a basic analysis based on user profile and responses
  const interests = userProfile.interests || [];

  // Use responses to inform analysis
  const responseKeys = Object.keys(responses);
  const hasResponses = responseKeys.length > 0;

  // Analyze responses for patterns (simplified)
  const responseValues = Object.values(responses);
  const showsAnalyticalThinking = responseValues.some(
    (value) =>
      typeof value === "string" &&
      (value.toLowerCase().includes("analysis") ||
        value.toLowerCase().includes("problem") ||
        value.toLowerCase().includes("logic")),
  );
  const isSTEMInterested = interests.some((interest) =>
    ["technology", "science", "mathematics", "engineering", "programming"].some(
      (stem) => interest.toLowerCase().includes(stem.toLowerCase()),
    ),
  );

  const isBusinessInterested = interests.some((interest) =>
    ["business", "management", "finance", "marketing"].some((business) =>
      interest.toLowerCase().includes(business.toLowerCase()),
    ),
  );

  const isCreativeInterested = interests.some((interest) =>
    ["design", "art", "creative", "writing", "media"].some((creative) =>
      interest.toLowerCase().includes(creative.toLowerCase()),
    ),
  );

  let primaryCareer, secondaryCareer;

  // Adjust recommendations based on responses
  const prefersTechnicalWork = isSTEMInterested || showsAnalyticalThinking;
  const hasExperienceIndicators =
    hasResponses &&
    responseValues.some(
      (value) => typeof value === "string" && value.length > 50, // Detailed responses suggest experience
    );

  if (prefersTechnicalWork) {
    primaryCareer = {
      title: "Software Developer",
      match: 88,
      description:
        "Your interest in technology and logical thinking make this an excellent career choice",
      growthPath:
        "Junior Developer → Senior Developer → Tech Lead → Engineering Manager",
      averageSalary: "₹6-25 LPA",
      keySkills: [
        "Programming",
        "Problem Solving",
        "Logical Thinking",
        "Technology",
      ],
      educationPath:
        "B.Tech Computer Science, B.Sc Computer Science, or coding bootcamps",
    };
    secondaryCareer = {
      title: "Data Analyst",
      match: 82,
      description:
        "Your analytical mindset suits data-driven decision making roles",
      growthPath:
        "Junior Analyst → Senior Analyst → Data Scientist → Analytics Manager",
      averageSalary: "₹5-20 LPA",
      keySkills: ["Data Analysis", "Statistics", "Excel", "Python"],
      educationPath:
        "B.Sc Statistics/Mathematics, B.Tech, or specialized analytics courses",
    };
  } else if (isBusinessInterested) {
    primaryCareer = {
      title: "Business Analyst",
      match: 85,
      description:
        "Your interest in business processes and problem-solving aligns well with this role",
      growthPath:
        "Junior BA → Senior BA → Product Manager → Business Unit Head",
      averageSalary: "₹5-18 LPA",
      keySkills: [
        "Business Analysis",
        "Communication",
        "Problem Solving",
        "Data Analysis",
      ],
      educationPath: "BBA, B.Com, or MBA for advanced roles",
    };
    secondaryCareer = {
      title: "Digital Marketing Specialist",
      match: 78,
      description:
        "Combines business acumen with digital skills for modern marketing",
      growthPath:
        "Marketing Executive → Senior Specialist → Marketing Manager → Head of Marketing",
      averageSalary: "₹4-15 LPA",
      keySkills: [
        "Digital Marketing",
        "Analytics",
        "Communication",
        "Creativity",
      ],
      educationPath: "Any degree with digital marketing certifications",
    };
  } else if (isCreativeInterested) {
    primaryCareer = {
      title: "UX/UI Designer",
      match: 83,
      description:
        "Your creative interests and user-focused thinking suit design roles perfectly",
      growthPath:
        "Junior Designer → Senior Designer → Lead Designer → Design Manager",
      averageSalary: "₹4-18 LPA",
      keySkills: [
        "Design",
        "User Research",
        "Prototyping",
        "Creative Thinking",
      ],
      educationPath:
        "Design degree or specialized UX/UI courses and portfolio development",
    };
    secondaryCareer = {
      title: "Content Creator",
      match: 77,
      description:
        "Leverage your creativity to build engaging content across platforms",
      growthPath:
        "Content Writer → Content Manager → Content Strategy Lead → Creative Director",
      averageSalary: "₹3-15 LPA",
      keySkills: ["Writing", "Creativity", "Social Media", "Marketing"],
      educationPath:
        "Mass Communication, English, or relevant skill-based courses",
    };
  } else {
    // Default careers for general profile
    primaryCareer = {
      title: "Project Manager",
      match: 80,
      description:
        "Your organizational skills and leadership potential make this a great fit",
      growthPath:
        "Assistant PM → Project Manager → Senior PM → Program Manager",
      averageSalary: "₹6-22 LPA",
      keySkills: [
        "Project Management",
        "Leadership",
        "Communication",
        "Organization",
      ],
      educationPath: "Any bachelor's degree with PMP certification",
    };
    secondaryCareer = {
      title: "Business Development Associate",
      match: 75,
      description:
        "Combine relationship building with business growth opportunities",
      growthPath: "BDA → Senior BDA → BD Manager → VP Business Development",
      averageSalary: "₹4-16 LPA",
      keySkills: [
        "Communication",
        "Sales",
        "Relationship Building",
        "Business Acumen",
      ],
      educationPath: "BBA, B.Com, or MBA preferred",
    };
  }

  return {
    overallAnalysis: `Based on your profile and interests in ${interests.join(", ")}, ${hasExperienceIndicators ? "your detailed responses show strong self-awareness and" : "you show"} potential for roles that combine analytical thinking with your natural interests. Your educational background in ${userProfile.course} provides a solid foundation for multiple career paths. ${showsAnalyticalThinking ? "Your analytical mindset and" : "You demonstrate"} problem-solving abilities and show interest in continuous learning, which are valuable traits in today's dynamic job market.`,
    recommendedCareers: [primaryCareer, secondaryCareer],
    courseRecommendations: [
      {
        course: isSTEMInterested
          ? "B.Tech Computer Science"
          : isBusinessInterested
            ? "BBA/MBA"
            : "Relevant Specialization",
        institution: "Top universities and colleges in your region",
        duration: "3-4 years",
        eligibility: "Based on current academic performance and entrance exams",
        careerOutcomes: [
          primaryCareer.title,
          secondaryCareer.title,
          "Related roles in the same field",
        ],
      },
    ],
    skillDevelopment: [
      ...primaryCareer.keySkills,
      "Communication Skills",
      "Leadership",
      "Time Management",
    ],
    actionPlan: [
      {
        timeline: "Next 3 months",
        actions: [
          `Research ${primaryCareer.title} role requirements`,
          "Start building relevant skills through online courses",
          "Connect with professionals in your field of interest",
          "Work on small projects to build experience",
        ],
      },
      {
        timeline: "6-12 months",
        actions: [
          "Complete relevant certifications",
          "Build a portfolio showcasing your skills",
          "Apply for internships in target companies",
          "Join professional communities and networks",
        ],
      },
      {
        timeline: "1-2 years",
        actions: [
          "Complete formal education/training programs",
          "Gain practical experience through internships or entry-level roles",
          "Build a strong professional network",
          "Apply for full-time positions in target companies",
        ],
      },
    ],
    scholarships: [
      "National Scholarship Portal (NSP) schemes",
      "Merit-based scholarships in target institutions",
      "Industry-sponsored scholarships and programs",
      "Government schemes for your category/region",
    ],
    resources: [
      "Coursera and edX for online learning",
      "LinkedIn Learning for professional skills",
      "Industry-specific platforms and communities",
      "Books and resources recommended for your field",
      "Professional networking events and conferences",
    ],
  };
}

function getDefaultAssessment(): AssessmentResponse {
  return {
    title: "Career Assessment",
    description:
      "Discover your ideal career path through this comprehensive assessment",
    estimatedTime: 15,
    questions: [
      {
        id: "q1",
        type: "mcq",
        category: "Academic Preferences",
        question: "Which type of subjects do you find most engaging?",
        options: [
          "Mathematics and Logic",
          "Languages and Literature",
          "Science and Research",
          "Arts and Creativity",
        ],
        required: true,
      },
      {
        id: "q2",
        type: "text",
        category: "Career Goals",
        question: "Describe your ideal work environment in 2-3 sentences.",
        placeholder:
          "E.g., I prefer working in teams, outdoor settings, creative spaces...",
        required: true,
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
          maxLabel: "Very Important",
        },
        required: true,
      },
      {
        id: "q4",
        type: "mcq",
        category: "Personality",
        question: "You prefer to work:",
        options: [
          "Alone",
          "In small groups",
          "In large teams",
          "Varies by project",
        ],
        required: true,
      },
      {
        id: "q5",
        type: "multi-select",
        category: "Skills",
        question:
          "Which skills do you want to develop further? (Select all that apply)",
        options: [
          "Technical Skills",
          "Leadership",
          "Communication",
          "Creative Skills",
          "Analytical Thinking",
          "Problem Solving",
        ],
        required: true,
      },
    ],
  };
}
