"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  TrendingUp,
  Target,
  BookOpen,
  DollarSign,
  ArrowRight,
  Download,
  Share,
  CheckCircle,
  Star,
  Zap,
  Map,
  Lightbulb,
  Briefcase,
  Clock,
  Users,
  BarChart3,
  Compass,
  Rocket,
  TrendingDown,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Calendar,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { AssessmentService } from "@/lib/services/assessmentService";

interface CareerMatch {
  career: string;
  matchPercentage: number;
  requiredSkills: string[];
  industryTrends: {
    growth: string;
    demand: string;
    averageSalary: string;
  };
  description?: string;
  educationPath?: string;
}

interface AssessmentReport {
  overallAnalysis: string;
  topCareerMatches: CareerMatch[];
  skillGaps: string[];
  recommendedLearningPath: string[];
  personalityType: string;
  interests: string[];
  completedAt: string;
  strengths?: string[];
  weaknesses?: string[];
  actionPlan?: Array<{
    timeline: string;
    actions: string[];
  }>;
}

export default function AssessmentReportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedCareer, setSelectedCareer] = useState<CareerMatch | null>(
    null,
  );

  useEffect(() => {
    const loadAssessmentReport = async () => {
      if (!user) return;

      try {
        const results = await AssessmentService.getAssessmentResults(user.uid);
        if (!results) {
          router.push("/career-assessment");
          return;
        }

        // Enhance the report data with additional information
        const enhancedReport: AssessmentReport = {
          ...results,
          overallAnalysis:
            results.personalityType ||
            "Based on your assessment responses, here's your personalized career profile.",
          strengths: results.strengths || [
            "Analytical thinking",
            "Problem-solving",
            "Communication skills",
            "Adaptability",
          ],
          weaknesses: results.weaknesses || [
            "Time management",
            "Public speaking",
            "Leadership experience",
          ],
          actionPlan: results.actionPlan || [
            {
              timeline: "Next 3 months",
              actions: [
                "Complete relevant online courses",
                "Build portfolio projects",
                "Network with industry professionals",
              ],
            },
            {
              timeline: "3-6 months",
              actions: [
                "Apply for internships",
                "Attend industry conferences",
                "Start personal projects",
              ],
            },
          ],
        };

        setReport(enhancedReport);
        if (enhancedReport.topCareerMatches.length > 0) {
          setSelectedCareer(enhancedReport.topCareerMatches[0]);
        }
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
    console.log("Downloading assessment report...");
  };

  const shareReport = () => {
    console.log("Sharing assessment report...");
  };

  const getGrowthColor = (growth: string) => {
    if (growth?.toLowerCase().includes("high")) return "text-green-600";
    if (growth?.toLowerCase().includes("moderate")) return "text-yellow-600";
    return "text-red-600";
  };

  const getGrowthIcon = (growth: string) => {
    if (growth?.toLowerCase().includes("high"))
      return <TrendingUp className="h-4 w-4" />;
    if (growth?.toLowerCase().includes("moderate"))
      return <Activity className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto"></div>
            <h3 className="text-lg font-semibold">Loading Your Report</h3>
            <p className="text-muted-foreground">
              Preparing your comprehensive career assessment report...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange/5 via-background to-orange/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange to-orange/80 flex items-center justify-center text-white">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange to-orange/80 bg-clip-text text-transparent">
                    Career Assessment Report
                  </h1>
                  <p className="text-muted-foreground flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Completed on{" "}
                      {new Date(report.completedAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={shareReport}
                className="flex items-center space-x-2"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button
                onClick={downloadReport}
                className="bg-orange hover:bg-orange/90 text-white flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "careers", label: "Career Matches", icon: Briefcase },
              { id: "skills", label: "Skills & Growth", icon: Zap },
              { id: "roadmap", label: "Action Plan", icon: Map },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-blue-200/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Career Matches
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {report.topCareerMatches.length}
                      </p>
                    </div>
                    <Briefcase className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500/10 to-green-600/5 border-green-200/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Best Match
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {report.topCareerMatches[0]?.matchPercentage || 0}%
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 border-purple-200/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Skills to Develop
                      </p>
                      <p className="text-3xl font-bold text-purple-600">
                        {report.skillGaps.length}
                      </p>
                    </div>
                    <Zap className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border-orange-200/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Learning Path
                      </p>
                      <p className="text-3xl font-bold text-orange-600">
                        {report.recommendedLearningPath.length}
                      </p>
                    </div>
                    <BookOpen className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personality & Interests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-orange" />
                    <span>Personality Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-orange/10 to-orange/5 rounded-lg border border-orange/20">
                      <h3 className="font-semibold text-lg text-orange mb-2">
                        {report.personalityType}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {report.overallAnalysis}
                      </p>
                    </div>

                    {report.strengths && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Key Strengths</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {report.strengths.map((strength, index) => (
                            <Badge
                              key={index}
                              className="bg-green-100 text-green-800 border-green-200"
                            >
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-orange" />
                    <span>Interests & Areas of Focus</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {report.interests.map((interest, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-muted rounded-md"
                        >
                          <Lightbulb className="h-4 w-4 text-orange" />
                          <span className="text-sm font-medium">
                            {interest}
                          </span>
                        </div>
                      ))}
                    </div>

                    {report.weaknesses && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-orange" />
                          <span>Areas for Improvement</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {report.weaknesses.map((weakness, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-orange/50 text-orange"
                            >
                              {weakness}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "careers" && (
          <div className="space-y-6">
            {/* Career Matches Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Career List */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-xl font-semibold mb-4">
                  Top Career Matches
                </h2>
                {report.topCareerMatches.map((career, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedCareer?.career === career.career
                        ? "ring-2 ring-orange border-orange"
                        : "hover:border-orange/50"
                    }`}
                    onClick={() => setSelectedCareer(career)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange to-orange/80 flex items-center justify-center text-white text-sm font-bold">
                            #{index + 1}
                          </div>
                          <span className="font-semibold text-sm">
                            {career.career}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Match Score
                          </span>
                          <span className="font-bold text-orange">
                            {career.matchPercentage}%
                          </span>
                        </div>
                        <Progress
                          value={career.matchPercentage}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Career Details */}
              <div className="lg:col-span-2">
                {selectedCareer && (
                  <Card className="h-fit">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange to-orange/80 flex items-center justify-center text-white">
                            <Briefcase className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl">{selectedCareer.career}</h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedCareer.matchPercentage}% match
                            </p>
                          </div>
                        </CardTitle>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Recommended
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Industry Trends */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-orange" />
                          <span>Industry Outlook</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              {getGrowthIcon(
                                selectedCareer.industryTrends.growth,
                              )}
                              <span className="text-sm font-medium">
                                Growth
                              </span>
                            </div>
                            <p
                              className={`text-sm font-semibold ${getGrowthColor(selectedCareer.industryTrends.growth)}`}
                            >
                              {selectedCareer.industryTrends.growth}
                            </p>
                          </div>

                          <div className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">
                                Demand
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-blue-600">
                              {selectedCareer.industryTrends.demand}
                            </p>
                          </div>

                          <div className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium">
                                Salary
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-green-600">
                              {selectedCareer.industryTrends.averageSalary}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Required Skills */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-orange" />
                          <span>Key Skills Required</span>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCareer.requiredSkills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-orange/50 text-orange hover:bg-orange/10"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                        <Button className="bg-orange hover:bg-orange/90 text-white flex items-center space-x-2">
                          <ExternalLink className="h-4 w-4" />
                          <span>Explore Career Path</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center space-x-2"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>Find Courses</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skill Gaps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange" />
                    <span>Skills to Develop</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.skillGaps.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-orange/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-orange">
                              {index + 1}
                            </span>
                          </div>
                          <span className="font-medium">{skill}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange border-orange hover:bg-orange/10"
                        >
                          <BookOpen className="h-3 w-3 mr-1" />
                          Learn
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Path */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Map className="h-5 w-5 text-orange" />
                    <span>Recommended Learning Path</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.recommendedLearningPath.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gradient-to-r from-orange/5 to-transparent rounded-lg border-l-2 border-orange"
                      >
                        <div className="h-6 w-6 rounded-full bg-orange text-white flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Rocket className="h-5 w-5 text-orange" />
                  <span>Your Personalized Action Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {report.actionPlan && (
                  <div className="space-y-6">
                    {report.actionPlan.map((phase, index) => (
                      <div key={index} className="relative">
                        {index < report.actionPlan!.length - 1 && (
                          <div className="absolute left-4 top-10 h-full w-0.5 bg-orange/30"></div>
                        )}

                        <div className="flex items-start space-x-4">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange to-orange/80 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-orange mb-2 flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{phase.timeline}</span>
                            </h3>

                            <div className="space-y-2">
                              {phase.actions.map((action, actionIndex) => (
                                <div
                                  key={actionIndex}
                                  className="flex items-start space-x-2 p-3 bg-muted rounded-lg"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span className="text-sm">{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Steps CTA */}
            <Card className="bg-gradient-to-r from-orange/10 via-orange/5 to-transparent border-orange/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-orange to-orange/80 flex items-center justify-center text-white mx-auto">
                    <Compass className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange mb-2">
                      Ready to Start Your Journey?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Take the next step towards your career goals with our
                      personalized resources and guidance.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      className="bg-orange hover:bg-orange/90 text-white"
                      onClick={() => router.push("/career-path")}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      View Career Paths
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/courses")}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Find Courses
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
