import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface LegacyAnalysis {
  overallAnalysis?: string;
  recommendedCareers?: Array<{
    title: string;
    match: number;
    keySkills: string[];
    averageSalary?: string;
  }>;
  skillDevelopment?: string[];
  actionPlan?: Array<{
    timeline: string;
    actions: string[];
  }>;
}

export interface AssessmentResult {
  topCareerMatches: Array<{
    career: string;
    matchPercentage: number;
    requiredSkills: string[];
    industryTrends: {
      growth: string;
      demand: string;
      averageSalary: string;
    };
  }>;
  skillGaps: string[];
  recommendedLearningPath: string[];
  personalityType: string;
  interests: string[];
  completedAt: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  currentRole: string;
  experience: string;
  education: string;
  interests: string[];
  skills: string[];
  goals: string[];
  assessmentResults?: AssessmentResult;
}

export class AssessmentService {
  /**
   * Check if user has completed the career assessment
   */
  static async hasCompletedAssessment(userId: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        return !!userData.assessmentResults;
      }
      return false;
    } catch (error) {
      console.error("Error checking assessment completion:", error);
      return false;
    }
  }

  /**
   * Get user's assessment results with migration support
   */
  static async getAssessmentResults(
    userId: string,
  ): Promise<AssessmentResult | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;

        if (userData.assessmentResults) {
          // Check if results are in new format
          if (userData.assessmentResults.topCareerMatches) {
            return userData.assessmentResults;
          }
        }

        // Try to get from old assessments collection
        try {
          const assessmentDoc = await getDoc(doc(db, "assessments", userId));
          if (assessmentDoc.exists()) {
            const assessmentData = assessmentDoc.data();
            // Migrate old format to new format
            const migratedResults = this.migrateAssessmentResults(
              assessmentData.analysis,
            );

            // Update user document with migrated results
            const { updateDoc } = await import("firebase/firestore");
            await updateDoc(doc(db, "users", userId), {
              assessmentResults: migratedResults,
            });

            return migratedResults;
          }
        } catch (migrationError) {
          console.error("Error migrating assessment results:", migrationError);
        }

        return userData.assessmentResults || null;
      }
      return null;
    } catch (error) {
      console.error("Error fetching assessment results:", error);
      return null;
    }
  }

  /**
   * Get user profile data
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  /**
   * Get personalized career recommendations based on assessment
   */
  static getCareerRecommendations(results: AssessmentResult): Array<{
    career: string;
    matchPercentage: number;
    priority: "high" | "medium" | "low";
    reason: string;
  }> {
    if (!results.topCareerMatches) return [];

    return results.topCareerMatches.map((match) => {
      let priority: "high" | "medium" | "low" = "low";
      let reason = "Based on your assessment results";

      if (match.matchPercentage >= 85) {
        priority = "high";
        reason = "Excellent match for your skills and interests";
      } else if (match.matchPercentage >= 70) {
        priority = "medium";
        reason = "Good alignment with your profile";
      }

      return {
        career: match.career,
        matchPercentage: match.matchPercentage,
        priority,
        reason,
      };
    });
  }

  /**
   * Get skill gap analysis
   */
  static getSkillGapAnalysis(results: AssessmentResult): Array<{
    skill: string;
    importance: "critical" | "important" | "nice-to-have";
    timeToLearn: string;
    resources: Array<{
      type: "course" | "certification" | "practice";
      title: string;
      url?: string;
    }>;
  }> {
    if (!results.skillGaps) return [];

    return results.skillGaps.map((skill) => {
      // Determine importance based on career matches
      const isInHighMatchCareers = results.topCareerMatches
        .filter((match) => match.matchPercentage >= 80)
        .some((match) =>
          match.requiredSkills.some((reqSkill) =>
            reqSkill.toLowerCase().includes(skill.toLowerCase()),
          ),
        );

      const importance: "critical" | "important" | "nice-to-have" =
        isInHighMatchCareers ? "critical" : "important";

      // Estimate time to learn (simplified logic)
      const timeToLearn =
        skill.toLowerCase().includes("programming") ||
        skill.toLowerCase().includes("data")
          ? "3-6 months"
          : "1-3 months";

      // Generate sample resources
      const resources = [
        {
          type: "course" as const,
          title: `Learn ${skill}`,
          url: `/courses?search=${encodeURIComponent(skill)}`,
        },
        {
          type: "practice" as const,
          title: `${skill} Practice Projects`,
        },
      ];

      return {
        skill,
        importance,
        timeToLearn,
        resources,
      };
    });
  }

  /**
   * Generate learning path based on assessment results
   */
  static generateLearningPath(results: AssessmentResult): Array<{
    phase: string;
    duration: string;
    skills: string[];
    milestones: string[];
    resources: Array<{
      type: "course" | "project" | "certification";
      title: string;
      priority: "high" | "medium" | "low";
    }>;
  }> {
    const topCareer = results.topCareerMatches?.[0];
    if (!topCareer) return [];

    // Generate a 3-phase learning path
    const phases = [
      {
        phase: "Foundation (Months 1-3)",
        duration: "3 months",
        skills: results.skillGaps.slice(0, 3) || ["Basic skills"],
        milestones: [
          "Complete foundational courses",
          "Build first portfolio project",
          "Join relevant communities",
        ],
        resources: [
          {
            type: "course" as const,
            title: "Foundations Course",
            priority: "high" as const,
          },
          {
            type: "project" as const,
            title: "Beginner Project",
            priority: "high" as const,
          },
        ],
      },
      {
        phase: "Development (Months 4-8)",
        duration: "5 months",
        skills: results.skillGaps.slice(3, 6) || ["Intermediate skills"],
        milestones: [
          "Complete intermediate projects",
          "Gain practical experience",
          "Start networking in the field",
        ],
        resources: [
          {
            type: "project" as const,
            title: "Advanced Project",
            priority: "high" as const,
          },
          {
            type: "certification" as const,
            title: "Professional Certification",
            priority: "medium" as const,
          },
        ],
      },
      {
        phase: "Specialization (Months 9-12)",
        duration: "4 months",
        skills: ["Advanced specialization", "Leadership", "Industry expertise"],
        milestones: [
          "Complete capstone project",
          "Apply for target positions",
          "Become job-ready",
        ],
        resources: [
          {
            type: "project" as const,
            title: "Capstone Project",
            priority: "high" as const,
          },
          {
            type: "course" as const,
            title: "Advanced Specialization",
            priority: "medium" as const,
          },
        ],
      },
    ];

    return phases;
  }

  /**
   * Get industry insights based on assessment results
   */
  static getIndustryInsights(results: AssessmentResult): {
    trends: string[];
    outlook: string;
    keySkills: string[];
    averageSalary: string;
    jobGrowth: string;
  } {
    const topCareer = results.topCareerMatches?.[0];

    if (!topCareer) {
      return {
        trends: ["Complete your assessment to see industry insights"],
        outlook: "Assessment needed",
        keySkills: [],
        averageSalary: "N/A",
        jobGrowth: "N/A",
      };
    }

    return {
      trends: [
        "Increasing demand for digital skills",
        "Remote work opportunities growing",
        "AI and automation changing job requirements",
        "Emphasis on continuous learning",
      ],
      outlook: "Positive growth expected in the coming years",
      keySkills: topCareer.requiredSkills || [],
      averageSalary: topCareer.industryTrends?.averageSalary || "Competitive",
      jobGrowth: topCareer.industryTrends?.growth || "Steady growth",
    };
  }

  /**
   * Check if user needs to retake assessment (older than 6 months)
   */
  static shouldRetakeAssessment(results: AssessmentResult): boolean {
    if (!results.completedAt) return true;

    const completedDate = new Date(results.completedAt);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return completedDate < sixMonthsAgo;
  }

  /**
   * Get assessment completion percentage for progress tracking
   */
  static getAssessmentProgress(results: AssessmentResult | null): number {
    if (!results) return 0;

    let completionScore = 0;
    const maxScore = 5;

    // Check for various assessment components
    if (results.topCareerMatches && results.topCareerMatches.length > 0)
      completionScore++;
    if (results.skillGaps && results.skillGaps.length > 0) completionScore++;
    if (results.personalityType) completionScore++;
    if (results.interests && results.interests.length > 0) completionScore++;
    if (
      results.recommendedLearningPath &&
      results.recommendedLearningPath.length > 0
    )
      completionScore++;

    return Math.round((completionScore / maxScore) * 100);
  }

  /**
   * Migrate old assessment format to new format
   */
  static migrateAssessmentResults(
    oldAnalysis: LegacyAnalysis,
  ): AssessmentResult {
    if (!oldAnalysis) {
      return {
        topCareerMatches: [],
        skillGaps: [],
        recommendedLearningPath: [],
        personalityType: "Unknown",
        interests: [],
        completedAt: new Date().toISOString(),
      };
    }

    // Transform old format to new format
    const topCareerMatches = (oldAnalysis.recommendedCareers || []).map(
      (career) => ({
        career: career.title || "Unknown Career",
        matchPercentage: career.match || 70,
        requiredSkills: career.keySkills || [],
        industryTrends: {
          growth: "Positive",
          demand: "High",
          averageSalary: career.averageSalary || "Competitive",
        },
      }),
    );

    const skillGaps = oldAnalysis.skillDevelopment || [];

    const recommendedLearningPath = (oldAnalysis.actionPlan || []).map(
      (plan) =>
        `${plan.timeline}: ${plan.actions?.join(", ") || "Continue learning"}`,
    );

    return {
      topCareerMatches,
      skillGaps,
      recommendedLearningPath,
      personalityType:
        oldAnalysis.overallAnalysis?.slice(0, 100) || "Analytical",
      interests: [],
      completedAt: new Date().toISOString(),
    };
  }

  /**
   * Validate assessment results structure
   */
  static validateAssessmentResults(
    results: unknown,
  ): results is AssessmentResult {
    if (!results || typeof results !== "object") return false;

    const res = results as Record<string, unknown>;

    return (
      Array.isArray(res.topCareerMatches) &&
      Array.isArray(res.skillGaps) &&
      Array.isArray(res.recommendedLearningPath) &&
      typeof res.personalityType === "string" &&
      Array.isArray(res.interests)
    );
  }

  /**
   * Get assessment completion status with better error handling
   */
  static async getAssessmentStatus(userId: string): Promise<{
    completed: boolean;
    results: AssessmentResult | null;
    needsRetake: boolean;
  }> {
    try {
      const results = await this.getAssessmentResults(userId);
      const completed = !!results;
      const needsRetake = results
        ? this.shouldRetakeAssessment(results)
        : false;

      return {
        completed,
        results,
        needsRetake,
      };
    } catch (error) {
      console.error("Error getting assessment status:", error);
      return {
        completed: false,
        results: null,
        needsRetake: false,
      };
    }
  }
}
