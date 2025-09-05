"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  TrendingUp,
  Target,
  BookOpen,
  Award,
  DollarSign,
  ArrowRight,
  Download,
  Share,
  RefreshCw,
  CheckCircle,
  Star,
  Zap,
  Map,
  Lightbulb,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { AssessmentService } from "@/lib/services/assessmentService";

interface AssessmentReport {
  overallAnalysis: string;
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
  fullAnalysis?: unknown;
}

export default function AssessmentReportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const loadAssessmentReport = async () => {
      if (!user) return;

      try {
        const results = await AssessmentService.getAssessmentResults(user.uid);
        if (!results) {
          router.push("/career-assessment");
          return;
        }
        setReport({
          ...results,
          overallAnalysis:
            results.personalityType ||
            "Based on your assessment responses, here's your personalized career profile.",
        });
      } catch (error) {
        console.error("Error loading assessment report:", error);
        router.push("/career-assessment");
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }
      loadAssessmentReport();
    }
  }, [user, loading, router]);

  const downloadReport = () => {
    // In a real implementation, this would generate a PDF
    console.log("Downloading assessment report...");
  };

  const shareReport = () => {
    // In a real implementation, this would enable sharing
    console.log("Sharing assessment report...");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-orange flex items-center justify-center text-white shadow-lg mx-auto mb-6">
            <Brain className="h-8 w-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Loading Your Report</h2>
          <p className="text-muted-foreground">
            Preparing your comprehensive career assessment report...
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">No Assessment Found</h2>
          <p className="text-muted-foreground mb-6">
            You haven&apos;t completed your career assessment yet.
          </p>
          <Button onClick={() => router.push("/career-assessment")}>
            Take Assessment
          </Button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "overview", label: "Overview", icon: Target },
    { id: "careers", label: "Career Matches", icon: Briefcase },
    { id: "skills", label: "Skills & Development", icon: Zap },
    { id: "learning", label: "Learning Path", icon: Map },
    { id: "insights", label: "Insights", icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange/10 to-orange/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-orange flex items-center justify-center text-white">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Career Assessment Report</h1>
                <p className="text-muted-foreground">
                  Completed on{" "}
                  {new Date(report.completedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={shareReport}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={downloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => router.push("/career-assessment")}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retake
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white/50 rounded-lg p-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-white shadow-sm text-orange-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <section.icon className="h-4 w-4" />
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Your Career Profile Overview
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                {report.overallAnalysis ||
                  "Based on your assessment responses, here's your personalized career profile."}
              </p>
            </div>

            {/* Mind Map Style Layout */}
            <div className="relative">
              {/* Center Node */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange to-orange/80 flex items-center justify-center text-white shadow-2xl">
                  <div className="text-center">
                    <Brain className="h-8 w-8 mx-auto mb-1" />
                    <div className="text-sm font-semibold">YOU</div>
                  </div>
                </div>
              </div>

              {/* Career Matches Branch */}
              <div className="absolute top-0 left-0">
                <div className="relative">
                  <div className="w-48 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">
                        Top Career Match
                      </h3>
                    </div>
                    <div className="text-lg font-bold text-blue-900">
                      {report.topCareerMatches[0]?.career || "Career Match"}
                    </div>
                    <div className="text-sm text-blue-700">
                      {report.topCareerMatches[0]?.matchPercentage || 85}% Match
                    </div>
                  </div>
                  <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-blue-300"></div>
                </div>
              </div>

              {/* Skills Branch */}
              <div className="absolute top-0 right-0">
                <div className="relative">
                  <div className="absolute top-1/2 -left-8 w-8 h-0.5 bg-green-300"></div>
                  <div className="w-48 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">
                        Skills to Develop
                      </h3>
                    </div>
                    <div className="text-sm text-green-700">
                      {report.skillGaps.length} skill areas identified
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      {report.skillGaps.slice(0, 2).join(", ")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Path Branch */}
              <div className="absolute bottom-0 left-0">
                <div className="relative">
                  <div className="w-48 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Map className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-800">
                        Learning Path
                      </h3>
                    </div>
                    <div className="text-sm text-purple-700">
                      {report.recommendedLearningPath.length} step roadmap
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      Personalized for you
                    </div>
                  </div>
                  <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-purple-300"></div>
                </div>
              </div>

              {/* Personality Branch */}
              <div className="absolute bottom-0 right-0">
                <div className="relative">
                  <div className="absolute top-1/2 -left-8 w-8 h-0.5 bg-yellow-300"></div>
                  <div className="w-48 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-semibold text-yellow-800">
                        Personality Type
                      </h3>
                    </div>
                    <div className="text-sm font-medium text-yellow-900">
                      {report.personalityType}
                    </div>
                    <div className="text-xs text-yellow-700 mt-1">
                      {report.interests.length} interests identified
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting Lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ height: "400px" }}
              >
                <line
                  x1="50%"
                  y1="50%"
                  x2="25%"
                  y2="25%"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
                <line
                  x1="50%"
                  y1="50%"
                  x2="75%"
                  y2="25%"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
                <line
                  x1="50%"
                  y1="50%"
                  x2="25%"
                  y2="75%"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
                <line
                  x1="50%"
                  y1="50%"
                  x2="75%"
                  y2="75%"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div style={{ height: "400px" }}></div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {report.topCareerMatches.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Career Matches
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {report.skillGaps.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Skills to Develop
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {report.recommendedLearningPath.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Learning Steps
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {report.interests.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Interests</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Career Matches Section */}
        {activeSection === "careers" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Career Matches</h2>
              <p className="text-muted-foreground">
                Based on your responses, here are careers that align with your
                interests and skills.
              </p>
            </div>

            <div className="space-y-4">
              {report.topCareerMatches.map((career, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div
                        className={`w-2 bg-gradient-to-b ${
                          index === 0
                            ? "from-green-400 to-green-600"
                            : index === 1
                              ? "from-blue-400 to-blue-600"
                              : "from-purple-400 to-purple-600"
                        }`}
                      ></div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                index === 0
                                  ? "bg-green-100 text-green-600"
                                  : index === 1
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-purple-100 text-purple-600"
                              }`}
                            >
                              {index === 0 ? (
                                <Target className="h-5 w-5" />
                              ) : index === 1 ? (
                                <TrendingUp className="h-5 w-5" />
                              ) : (
                                <Briefcase className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">
                                {career.career}
                              </h3>
                              <p className="text-muted-foreground">
                                #{index + 1} Career Match
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">
                              {career.matchPercentage}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Match Score
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Required Skills
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.requiredSkills.map((skill, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Industry Growth
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {career.industryTrends.growth}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Expected Salary
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {career.industryTrends.averageSalary}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {activeSection === "skills" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Skills & Development Areas
              </h2>
              <p className="text-muted-foreground">
                Areas where you can grow and develop to achieve your career
                goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.skillGaps.map((skill, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-4 w-4 text-orange" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{skill}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Developing this skill will enhance your career
                          prospects in your target field.
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            High Priority
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            3-6 months to develop
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Learning Path Section */}
        {activeSection === "learning" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Learning Path</h2>
              <p className="text-muted-foreground">
                A step-by-step roadmap to achieve your career goals.
              </p>
            </div>

            <div className="space-y-4">
              {report.recommendedLearningPath.map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        {index < report.recommendedLearningPath.length - 1 && (
                          <div className="w-0.5 h-16 bg-orange/30 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {step.split(":")[0] || `Step ${index + 1}`}
                        </h3>
                        <p className="text-muted-foreground">
                          {step.split(":")[1] || step}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Insights Section */}
        {activeSection === "insights" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Career Insights</h2>
              <p className="text-muted-foreground">
                Additional insights and recommendations based on your profile.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Strong analytical thinking
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Good problem-solving skills
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Interest in continuous learning
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Growth Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.skillGaps.slice(0, 3).map((skill, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-orange" />
                        <span className="text-sm">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Next Steps Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-blue-800">
                        Explore Courses
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Check personalized course recommendations
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Map className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-green-800">
                        Follow Career Path
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        View detailed progression roadmap
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-purple-800">
                        Access Resources
                      </h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Download tools and guides
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pt-8 border-t">
          <Button onClick={() => router.push("/courses")} size="lg">
            <BookOpen className="h-4 w-4 mr-2" />
            Explore Courses
          </Button>
          <Button
            onClick={() => router.push("/career-path")}
            size="lg"
            variant="outline"
          >
            <Map className="h-4 w-4 mr-2" />
            View Career Path
          </Button>
          <Button
            onClick={() => router.push("/resources")}
            size="lg"
            variant="outline"
          >
            <Award className="h-4 w-4 mr-2" />
            Access Resources
          </Button>
        </div>
      </div>
    </div>
  );
}
