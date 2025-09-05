"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  BookOpen,
  RefreshCw,
  FileText,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  generateAssessmentQuestions,
  analyzeAssessmentResponses,
} from "@/lib/gemini/assessment";

interface AnalysisResult {
  overallAnalysis?: string;
  recommendedCareers?: Array<{
    title: string;
    match: number;
    description: string;
    growthPath: string;
    averageSalary: string;
    keySkills: string[];
    educationPath: string;
  }>;
  skillDevelopment?: string[];
  actionPlan?: Array<{
    timeline: string;
    actions: string[];
  }>;
  courseRecommendations?: Array<{
    course: string;
    institution: string;
    duration: string;
    eligibility: string;
    careerOutcomes: string[];
  }>;
  scholarships?: string[];
  resources?: string[];
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

interface AssessmentData {
  title: string;
  description: string;
  estimatedTime: number;
  questions: AssessmentQuestion[];
}

interface UserProfile {
  displayName: string;
  age: number;
  course: string;
  stream: string;
  interests: string[];
  location: string;
  assessmentResults?: {
    topCareerMatches: Array<{
      career: string;
      matchPercentage: number;
      requiredSkills: string[];
    }>;
    skillGaps: string[];
    recommendedLearningPath: string[];
    personalityType: string;
    interests: string[];
    completedAt: string;
  };
}

export default function CareerAssessmentPage() {
  const { user, profileCompleted, loading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<
    "loading" | "intro" | "assessment" | "submitting" | "results" | "completed"
  >("loading");
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(
    null,
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [analysisResults, setAnalysisResults] = useState<unknown>(null);
  const [error, setError] = useState("");
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [existingResults, setExistingResults] = useState<
    UserProfile["assessmentResults"] | null
  >(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          setUserProfile(profile);

          // Check if user has completed assessment
          if (profile.assessmentResults) {
            setHasCompletedAssessment(true);
            setExistingResults(profile.assessmentResults);
            setStep("completed");
          } else {
            generateQuestions(profile);
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        setError("Failed to load profile. Please try again.");
        setStep("intro");
      }
    };

    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!profileCompleted) {
        router.push("/profile-setup");
      } else {
        loadUserProfile();
      }
    }
  }, [user, profileCompleted, loading, router]);

  const generateQuestions = async (profile: UserProfile) => {
    try {
      setStep("loading");
      const assessment = await generateAssessmentQuestions(profile);
      setAssessmentData(assessment);
      setStep("intro");
    } catch (error) {
      console.error("Error generating questions:", error);
      setError("Failed to generate assessment questions. Please try again.");
      setStep("intro");
    }
  };

  const startAssessment = () => {
    setStep("assessment");
    setCurrentQuestionIndex(0);
  };

  const handleResponse = (questionId: string, value: unknown) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const nextQuestion = () => {
    if (!assessmentData) return;

    if (currentQuestionIndex < assessmentData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      submitAssessment();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitAssessment = async () => {
    if (!userProfile || !user) return;

    try {
      setStep("submitting");

      // Analyze responses with Gemini
      const analysis = (await analyzeAssessmentResponses(
        userProfile,
        responses,
      )) as AnalysisResult;

      // Transform analysis to match expected format for other pages
      const assessmentResults = {
        topCareerMatches:
          analysis?.recommendedCareers?.map((career) => ({
            career: career.title,
            matchPercentage: career.match,
            requiredSkills: career.keySkills || [],
            industryTrends: {
              growth: "Positive",
              demand: "High",
              averageSalary: career.averageSalary || "Competitive",
            },
          })) || [],
        skillGaps: analysis?.skillDevelopment || [],
        recommendedLearningPath:
          analysis?.actionPlan?.map(
            (plan) => `${plan.timeline}: ${plan.actions?.join(", ") || ""}`,
          ) || [],
        personalityType:
          analysis?.overallAnalysis?.slice(0, 100) || "Analytical",
        interests: userProfile.interests || [],
        completedAt: new Date().toISOString(),
        fullAnalysis: analysis, // Keep full analysis for detailed view
      };

      // Save to assessments collection (detailed results)
      await setDoc(doc(db, "assessments", user.uid), {
        userId: user.uid,
        responses,
        analysis,
        completedAt: new Date(),
      });

      // Update user profile with assessment results (for other pages to access)
      await updateDoc(doc(db, "users", user.uid), {
        assessmentResults: assessmentResults,
        assessmentCompletedAt: new Date(),
      });

      setAnalysisResults(analysis);
      setExistingResults(assessmentResults);
      setHasCompletedAssessment(true);
      setStep("results");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      setError("Failed to analyze responses. Please try again.");
    }
  };

  const retakeAssessment = () => {
    setStep("intro");
    setCurrentQuestionIndex(0);
    setResponses({});
    setAnalysisResults(null);
    setError("");
  };

  const viewFullReport = () => {
    router.push("/assessment-report");
  };

  const renderQuestion = (question: AssessmentQuestion) => {
    const currentValue = responses[question.id];

    switch (question.type) {
      case "mcq":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                  currentValue === option
                    ? "border-orange bg-orange/10 text-orange"
                    : "border-border hover:border-orange/50 hover:bg-orange/5"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentValue === option}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                  className="text-orange focus:ring-orange"
                />
                <span className="font-medium">{option}</span>
              </label>
            ))}
          </div>
        );

      case "multi-select":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                  Array.isArray(currentValue) && currentValue.includes(option)
                    ? "border-orange bg-orange/10 text-orange"
                    : "border-border hover:border-orange/50 hover:bg-orange/5"
                }`}
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={
                    (Array.isArray(currentValue) &&
                      currentValue.includes(option)) ||
                    false
                  }
                  onChange={(e) => {
                    const current = Array.isArray(currentValue)
                      ? currentValue
                      : [];
                    if (e.target.checked) {
                      handleResponse(question.id, [...current, option]);
                    } else {
                      handleResponse(
                        question.id,
                        current.filter((item: unknown) => item !== option),
                      );
                    }
                  }}
                  className="text-orange focus:ring-orange"
                />
                <span className="font-medium">{option}</span>
              </label>
            ))}
          </div>
        );

      case "text":
        return (
          <textarea
            value={typeof currentValue === "string" ? currentValue : ""}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent min-h-24"
            rows={4}
          />
        );

      case "scale":
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{question.scaleRange?.minLabel}</span>
              <span>{question.scaleRange?.maxLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              {Array.from(
                {
                  length:
                    (question.scaleRange?.max || 10) -
                    (question.scaleRange?.min || 1) +
                    1,
                },
                (_, i) => {
                  const value = (question.scaleRange?.min || 1) + i;
                  return (
                    <button
                      key={value}
                      onClick={() => handleResponse(question.id, value)}
                      className={`w-10 h-10 rounded-full border-2 font-semibold transition-all ${
                        currentValue === (value as unknown)
                          ? "border-orange bg-orange text-white"
                          : "border-border hover:border-orange"
                      }`}
                    >
                      {String(value)}
                    </button>
                  );
                },
              )}
            </div>
            {currentValue !== null && currentValue !== undefined && (
              <p className="text-center text-sm text-muted-foreground">
                Selected: {String(currentValue)}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isCurrentQuestionAnswered = () => {
    if (!assessmentData) return false;
    const currentQuestion = assessmentData.questions[currentQuestionIndex];
    const response = responses[currentQuestion.id];

    if (!currentQuestion.required) return true;

    if (currentQuestion.type === "multi-select") {
      return response && Array.isArray(response) && response.length > 0;
    }

    return response !== undefined && response !== "";
  };

  if (loading || step === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-lg bg-orange flex items-center justify-center text-white shadow-lg mx-auto mb-4 animate-pulse">
            <Brain className="h-7 w-7" />
          </div>
          <p className="text-muted-foreground">
            Preparing your personalized assessment...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !profileCompleted || !userProfile) {
    return null;
  }

  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>

              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-orange flex items-center justify-center text-white shadow-lg mx-auto mb-6">
                  <Brain className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {assessmentData?.title || "Career Assessment"}
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  {assessmentData?.description ||
                    "Discover your ideal career path through this comprehensive assessment"}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange" />
                  Assessment Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <Clock className="h-5 w-5 text-orange" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {assessmentData?.estimatedTime || 15} minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-orange" />
                    <div>
                      <p className="font-medium">Questions</p>
                      <p className="text-sm text-muted-foreground">
                        {assessmentData?.questions.length || 0} questions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">What to expect:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        Personalized questions based on your profile and
                        interests
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        Mix of multiple choice, text responses, and rating
                        scales
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        Comprehensive career recommendations and action plan
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>
                        Course suggestions tailored to your educational level
                      </span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={startAssessment}
                  className="w-full bg-orange hover:bg-orange/90 text-white"
                  size="lg"
                  disabled={!assessmentData}
                >
                  Start Assessment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (step === "assessment" && assessmentData) {
    const currentQuestion = assessmentData.questions[currentQuestionIndex];
    const progress =
      ((currentQuestionIndex + 1) / assessmentData.questions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Progress Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="text-orange border-orange">
                  {currentQuestion.category}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {currentQuestionIndex + 1} of{" "}
                  {assessmentData.questions.length}
                </span>
              </div>

              <div className="w-full bg-muted rounded-full h-2 mb-6">
                <div
                  className="bg-orange h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
                {currentQuestion.required && (
                  <CardDescription className="text-red-500">
                    * This question is required
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>{renderQuestion(currentQuestion)}</CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={nextQuestion}
                disabled={!isCurrentQuestionAnswered()}
                className="bg-orange hover:bg-orange/90 text-white flex items-center gap-2"
              >
                {currentQuestionIndex ===
                assessmentData.questions.length - 1 ? (
                  <>Submit Assessment</>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === "submitting") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-orange flex items-center justify-center text-white shadow-lg mx-auto mb-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Analyzing Your Responses
          </h2>
          <p className="text-muted-foreground max-w-md">
            Our AI is processing your answers to provide personalized career
            recommendations. This may take a few moments.
          </p>
        </div>
      </div>
    );
  }

  if (step === "completed" && hasCompletedAssessment) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg mx-auto mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Assessment Already Completed
              </h1>
              <p className="text-lg text-muted-foreground">
                You have already completed your career assessment. You can view
                your detailed report or retake the assessment for updated
                results.
              </p>
            </div>

            <div className="space-y-6">
              {/* Assessment Status Card */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Assessment Status
                  </CardTitle>
                  <CardDescription>
                    Completed on{" "}
                    {existingResults?.completedAt
                      ? new Date(
                          existingResults.completedAt,
                        ).toLocaleDateString()
                      : "Recently"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Career Matches Found
                      </h4>
                      <p className="text-green-700">
                        {existingResults?.topCareerMatches?.length || 0}{" "}
                        personalized career recommendations
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Skills Identified
                      </h4>
                      <p className="text-blue-700">
                        {existingResults?.skillGaps?.length || 0} skill
                        development areas identified
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={viewFullReport}
                  size="lg"
                  className="bg-orange hover:bg-orange/90 text-white flex items-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  View Full Report
                </Button>
                <Button
                  onClick={retakeAssessment}
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Retake Assessment
                </Button>
              </div>

              {/* Quick Preview Card */}
              {existingResults?.topCareerMatches &&
                existingResults.topCareerMatches.length > 0 && (
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>Quick Preview - Top Career Match</CardTitle>
                      <CardDescription>
                        Your highest matching career recommendation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange/10 to-orange/5 rounded-lg border border-orange/20">
                        <div>
                          <h4 className="font-semibold text-foreground text-lg">
                            {existingResults.topCareerMatches[0].career}
                          </h4>
                          <p className="text-muted-foreground">
                            {
                              existingResults.topCareerMatches[0]
                                .matchPercentage
                            }
                            % match based on your profile
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange">
                            {
                              existingResults.topCareerMatches[0]
                                .matchPercentage
                            }
                            %
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Match Score
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === "results" && analysisResults) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg mx-auto mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Your Career Assessment Results
              </h1>
              <p className="text-lg text-muted-foreground">
                Based on your responses, here are your personalized
                recommendations
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Analysis Complete</CardTitle>
                  <CardDescription>
                    Your comprehensive career guidance report is ready
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={() => router.push("/assessment-report")}
                      className="bg-orange hover:bg-orange/90 text-white flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      View Full Report
                    </Button>
                    <Button
                      onClick={retakeAssessment}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retake Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
