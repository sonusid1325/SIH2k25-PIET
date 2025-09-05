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
  CheckCircle,
  Circle,
  Target,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  Users,
  AlertCircle,
  DollarSign,
  Briefcase,
  Star,
  Play,
  Lock,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface CareerPathStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  skillsRequired: string[];
  skillsGained: string[];
  averageSalary: string;
  jobTitles: string[];
  actions: Array<{
    type: "course" | "certification" | "project" | "networking";
    title: string;
    description: string;
    url?: string;
    completed?: boolean;
  }>;
  isCompleted: boolean;
  isCurrentStep: boolean;
  prerequisites?: string[];
}

interface CareerPath {
  id: string;
  title: string;
  description: string;
  industry: string;
  matchPercentage: number;
  totalDuration: string;
  averageStartingSalary: string;
  averageMidLevelSalary: string;
  averageSeniorSalary: string;
  jobGrowthRate: string;
  steps: CareerPathStep[];
}

interface AssessmentResult {
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
}

export default function CareerPathPage() {
  const { user, profileCompleted, loading } = useAuth();
  const router = useRouter();
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

  useEffect(() => {
    const loadAssessmentResults = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.assessmentResults) {
            setAssessmentResult(userData.assessmentResults);
            setHasCompletedAssessment(true);
            generateCareerPaths();
          } else {
            setHasCompletedAssessment(false);
          }
        }
      } catch (error) {
        console.error("Error loading assessment results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }
      if (!profileCompleted) {
        router.push("/profile-setup");
        return;
      }
      loadAssessmentResults();
    }
  }, [user, profileCompleted, loading, router]);

  const generateCareerPaths = () => {
    const paths: CareerPath[] = [
      // Data Science Path
      {
        id: "data-science",
        title: "Data Science Career Path",
        description:
          "Transform data into actionable insights and drive business decisions",
        industry: "Technology",
        matchPercentage: 92,
        totalDuration: "18-24 months",
        averageStartingSalary: "$70,000 - $90,000",
        averageMidLevelSalary: "$100,000 - $130,000",
        averageSeniorSalary: "$140,000 - $180,000",
        jobGrowthRate: "+22% (Much faster than average)",
        steps: [
          {
            id: "foundations",
            title: "Data Science Foundations",
            description: "Learn programming fundamentals and basic statistics",
            duration: "3-4 months",
            difficulty: "Beginner",
            skillsRequired: ["Basic Math", "Computer Literacy"],
            skillsGained: ["Python", "SQL", "Statistics", "Data Visualization"],
            averageSalary: "N/A (Learning Phase)",
            jobTitles: ["Student", "Aspiring Data Analyst"],
            actions: [
              {
                type: "course",
                title: "Python for Data Science",
                description: "Master Python programming for data analysis",
                url: "/courses?search=python+data+science",
              },
              {
                type: "course",
                title: "SQL Fundamentals",
                description: "Learn database querying and management",
                url: "/courses?search=sql",
              },
              {
                type: "project",
                title: "Data Cleaning Project",
                description: "Practice data preprocessing with real datasets",
              },
            ],
            isCompleted: false,
            isCurrentStep: true,
          },
          {
            id: "junior-analyst",
            title: "Junior Data Analyst",
            description: "Apply analytical skills to solve business problems",
            duration: "6-12 months",
            difficulty: "Intermediate",
            skillsRequired: ["Python", "SQL", "Statistics", "Excel"],
            skillsGained: [
              "Tableau/PowerBI",
              "A/B Testing",
              "Machine Learning Basics",
              "Business Acumen",
            ],
            averageSalary: "$55,000 - $70,000",
            jobTitles: [
              "Junior Data Analyst",
              "Business Analyst",
              "Research Analyst",
            ],
            actions: [
              {
                type: "certification",
                title: "Tableau Desktop Specialist",
                description: "Get certified in data visualization",
                url: "https://www.tableau.com/learn/certification",
              },
              {
                type: "project",
                title: "Sales Dashboard",
                description:
                  "Create interactive dashboards for business stakeholders",
              },
              {
                type: "networking",
                title: "Join Data Science Community",
                description:
                  "Connect with professionals on LinkedIn and local meetups",
              },
            ],
            isCompleted: false,
            isCurrentStep: false,
            prerequisites: ["foundations"],
          },
          {
            id: "data-scientist",
            title: "Data Scientist",
            description:
              "Build predictive models and advanced analytics solutions",
            duration: "12-18 months",
            difficulty: "Advanced",
            skillsRequired: [
              "Machine Learning",
              "Statistics",
              "Python/R",
              "SQL",
            ],
            skillsGained: [
              "Deep Learning",
              "MLOps",
              "Cloud Platforms",
              "Advanced Statistics",
            ],
            averageSalary: "$85,000 - $120,000",
            jobTitles: [
              "Data Scientist",
              "Machine Learning Engineer",
              "Analytics Consultant",
            ],
            actions: [
              {
                type: "course",
                title: "Machine Learning Specialization",
                description: "Master ML algorithms and model building",
                url: "/courses?search=machine+learning",
              },
              {
                type: "certification",
                title: "AWS Machine Learning Specialty",
                description: "Cloud ML certification",
                url: "https://aws.amazon.com/certification/",
              },
              {
                type: "project",
                title: "End-to-End ML Pipeline",
                description: "Build and deploy a complete ML solution",
              },
            ],
            isCompleted: false,
            isCurrentStep: false,
            prerequisites: ["junior-analyst"],
          },
          {
            id: "senior-data-scientist",
            title: "Senior Data Scientist / ML Lead",
            description:
              "Lead data science initiatives and mentor junior team members",
            duration: "18+ months",
            difficulty: "Advanced",
            skillsRequired: [
              "Advanced ML",
              "Leadership",
              "Business Strategy",
              "Architecture",
            ],
            skillsGained: [
              "Team Leadership",
              "Strategic Planning",
              "Research",
              "Innovation",
            ],
            averageSalary: "$130,000 - $180,000",
            jobTitles: [
              "Senior Data Scientist",
              "ML Engineering Manager",
              "Head of Analytics",
            ],
            actions: [
              {
                type: "course",
                title: "Leadership in Tech",
                description: "Develop management and leadership skills",
              },
              {
                type: "networking",
                title: "Industry Conferences",
                description:
                  "Speak at conferences and build thought leadership",
              },
              {
                type: "project",
                title: "Research Publication",
                description:
                  "Contribute to industry knowledge through research",
              },
            ],
            isCompleted: false,
            isCurrentStep: false,
            prerequisites: ["data-scientist"],
          },
        ],
      },
      // Software Development Path
      {
        id: "software-development",
        title: "Software Development Career Path",
        description:
          "Build applications and systems that power the digital world",
        industry: "Technology",
        matchPercentage: 88,
        totalDuration: "15-20 months",
        averageStartingSalary: "$65,000 - $85,000",
        averageMidLevelSalary: "$90,000 - $120,000",
        averageSeniorSalary: "$125,000 - $170,000",
        jobGrowthRate: "+13% (Faster than average)",
        steps: [
          {
            id: "programming-basics",
            title: "Programming Fundamentals",
            description:
              "Master programming concepts and web development basics",
            duration: "2-3 months",
            difficulty: "Beginner",
            skillsRequired: ["Basic Computer Skills"],
            skillsGained: ["JavaScript", "HTML/CSS", "Git", "Problem Solving"],
            averageSalary: "N/A (Learning Phase)",
            jobTitles: ["Student", "Coding Bootcamp Student"],
            actions: [
              {
                type: "course",
                title: "Full Stack Web Development",
                description: "Learn HTML, CSS, JavaScript, and Node.js",
                url: "/courses?search=web+development",
              },
              {
                type: "project",
                title: "Personal Portfolio Website",
                description: "Build your first website to showcase projects",
              },
            ],
            isCompleted: false,
            isCurrentStep: true,
          },
          {
            id: "junior-developer",
            title: "Junior Software Developer",
            description:
              "Build web applications and contribute to development teams",
            duration: "8-12 months",
            difficulty: "Intermediate",
            skillsRequired: [
              "JavaScript",
              "HTML/CSS",
              "Git",
              "Basic Programming",
            ],
            skillsGained: [
              "React/Vue",
              "Database Design",
              "API Development",
              "Testing",
            ],
            averageSalary: "$60,000 - $80,000",
            jobTitles: [
              "Junior Developer",
              "Frontend Developer",
              "Full Stack Developer",
            ],
            actions: [
              {
                type: "course",
                title: "React Development",
                description: "Master modern frontend frameworks",
                url: "/courses?search=react",
              },
              {
                type: "project",
                title: "E-commerce Application",
                description: "Build a full-stack web application",
              },
              {
                type: "certification",
                title: "AWS Cloud Practitioner",
                description: "Learn cloud deployment basics",
              },
            ],
            isCompleted: false,
            isCurrentStep: false,
          },
          {
            id: "software-engineer",
            title: "Software Engineer",
            description: "Design and implement complex software solutions",
            duration: "12-18 months",
            difficulty: "Advanced",
            skillsRequired: [
              "Full Stack Development",
              "System Design",
              "Database Management",
            ],
            skillsGained: [
              "Microservices",
              "DevOps",
              "System Architecture",
              "Performance Optimization",
            ],
            averageSalary: "$90,000 - $125,000",
            jobTitles: [
              "Software Engineer",
              "Backend Engineer",
              "DevOps Engineer",
            ],
            actions: [
              {
                type: "course",
                title: "System Design & Architecture",
                description: "Learn to design scalable systems",
              },
              {
                type: "certification",
                title: "Kubernetes Administration",
                description: "Master container orchestration",
              },
            ],
            isCompleted: false,
            isCurrentStep: false,
          },
        ],
      },
      // UX Design Path
      {
        id: "ux-design",
        title: "UX/UI Design Career Path",
        description: "Create intuitive and engaging user experiences",
        industry: "Design & Technology",
        matchPercentage: 85,
        totalDuration: "12-18 months",
        averageStartingSalary: "$55,000 - $70,000",
        averageMidLevelSalary: "$75,000 - $100,000",
        averageSeniorSalary: "$105,000 - $140,000",
        jobGrowthRate: "+8% (As fast as average)",
        steps: [
          {
            id: "design-fundamentals",
            title: "Design Fundamentals",
            description:
              "Learn design principles and user-centered design thinking",
            duration: "2-3 months",
            difficulty: "Beginner",
            skillsRequired: ["Creativity", "Visual Thinking"],
            skillsGained: [
              "Design Theory",
              "Figma",
              "User Research",
              "Wireframing",
            ],
            averageSalary: "N/A (Learning Phase)",
            jobTitles: ["Design Student", "Aspiring Designer"],
            actions: [
              {
                type: "course",
                title: "UX Design Fundamentals",
                description: "Learn the basics of user experience design",
                url: "/courses?search=ux+design",
              },
              {
                type: "project",
                title: "App Redesign Case Study",
                description: "Redesign an existing app's user interface",
              },
            ],
            isCompleted: false,
            isCurrentStep: true,
          },
          {
            id: "junior-designer",
            title: "Junior UX/UI Designer",
            description:
              "Create user interfaces and conduct basic user research",
            duration: "6-9 months",
            difficulty: "Intermediate",
            skillsRequired: ["Figma", "Design Theory", "Basic Research"],
            skillsGained: [
              "Prototyping",
              "User Testing",
              "Design Systems",
              "Collaboration",
            ],
            averageSalary: "$50,000 - $65,000",
            jobTitles: [
              "Junior UX Designer",
              "UI Designer",
              "Product Designer",
            ],
            actions: [
              {
                type: "certification",
                title: "Google UX Design Certificate",
                description: "Industry-recognized UX certification",
              },
              {
                type: "project",
                title: "Mobile App Design",
                description: "Design a complete mobile application",
              },
            ],
            isCompleted: false,
            isCurrentStep: false,
          },
        ],
      },
    ];

    // Sort paths by match percentage
    const sortedPaths = paths.sort(
      (a, b) => b.matchPercentage - a.matchPercentage,
    );
    setCareerPaths(sortedPaths);

    // Set the highest match as selected by default
    if (sortedPaths.length > 0) {
      setSelectedPath(sortedPaths[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!hasCompletedAssessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-orange mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">
            Complete Your Career Assessment
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            To see your personalized career path recommendations, you need to
            complete our comprehensive career assessment first. This will help
            us understand your interests, skills, and goals to create a tailored
            career roadmap just for you.
          </p>
          <Button
            onClick={() => router.push("/career-assessment")}
            size="lg"
            className="bg-orange hover:bg-orange/90"
          >
            <Award className="h-5 w-5 mr-2" />
            Take Career Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Career Path</h1>
        <p className="text-muted-foreground">
          Personalized career progression based on your assessment results
        </p>
      </div>

      {/* Career Path Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Path Options */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Recommended Paths</h2>
          <div className="space-y-4">
            {careerPaths.map((path) => (
              <Card
                key={path.id}
                className={`cursor-pointer transition-all ${
                  selectedPath?.id === path.id
                    ? "ring-2 ring-orange border-orange"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedPath(path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {path.industry}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      {path.matchPercentage}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{path.totalDuration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Starting Salary:
                      </span>
                      <span>{path.averageStartingSalary}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Growth Rate:
                      </span>
                      <span className="text-green-600">
                        {path.jobGrowthRate}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Path Details */}
        <div className="lg:col-span-2">
          {selectedPath && (
            <div className="space-y-6">
              {/* Path Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {selectedPath.title}
                      </CardTitle>
                      <CardDescription className="text-lg mt-2">
                        {selectedPath.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-500 text-white text-lg px-3 py-1">
                      {selectedPath.matchPercentage}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-orange" />
                      <div className="text-sm font-semibold">
                        {selectedPath.totalDuration}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Duration
                      </div>
                    </div>
                    <div className="text-center">
                      <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <div className="text-sm font-semibold">
                        {selectedPath.averageStartingSalary}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Starting Salary
                      </div>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-sm font-semibold">
                        {selectedPath.jobGrowthRate}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Job Growth
                      </div>
                    </div>
                    <div className="text-center">
                      <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                      <div className="text-sm font-semibold">
                        {selectedPath.averageSeniorSalary}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Senior Salary
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Steps */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Career Progression</h3>
                {selectedPath.steps.map((step) => (
                  <Card
                    key={step.id}
                    className={`${
                      step.isCurrentStep
                        ? "ring-2 ring-orange border-orange bg-orange/5"
                        : step.isCompleted
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200"
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {step.isCompleted ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : step.isCurrentStep ? (
                            <Target className="h-6 w-6 text-orange" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-semibold">
                                {step.title}
                              </h4>
                              <p className="text-muted-foreground">
                                {step.description}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  step.difficulty === "Beginner"
                                    ? "secondary"
                                    : step.difficulty === "Intermediate"
                                      ? "default"
                                      : "destructive"
                                }
                              >
                                {step.difficulty}
                              </Badge>
                              {step.isCurrentStep && (
                                <Badge className="bg-orange text-white">
                                  Current
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Step Details */}
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-semibold mb-2">
                              Timeline & Compensation
                            </h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Duration:</span>
                                <span>{step.duration}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Average Salary:</span>
                                <span>{step.averageSalary}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-semibold mb-2">
                              Skills Required
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {step.skillsRequired.map((skill, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-semibold mb-2">
                              Skills You&apos;ll Gain
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {step.skillsGained.map((skill, idx) => (
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
                        </div>

                        {/* Action Items */}
                        <div>
                          <h5 className="font-semibold mb-2">Action Items</h5>
                          <div className="space-y-2">
                            {step.actions.map((action, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="flex-shrink-0">
                                    {action.type === "course" && (
                                      <BookOpen className="h-4 w-4" />
                                    )}
                                    {action.type === "certification" && (
                                      <Award className="h-4 w-4" />
                                    )}
                                    {action.type === "project" && (
                                      <Briefcase className="h-4 w-4" />
                                    )}
                                    {action.type === "networking" && (
                                      <Users className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">
                                      {action.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {action.description}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {action.completed && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                  {action.url ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        action.url && router.push(action.url)
                                      }
                                    >
                                      <Play className="h-3 w-3" />
                                    </Button>
                                  ) : (
                                    <Lock className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Job Titles */}
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-semibold mb-2">
                          Potential Job Titles
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {step.jobTitles.map((title, idx) => (
                            <Badge key={idx} variant="outline">
                              {title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Next Steps */}
              <Card className="bg-gradient-to-r from-orange/5 to-orange/10 border-orange/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Zap className="h-8 w-8 text-orange" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        Ready to Get Started?
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Begin your journey with the recommended courses and
                        resources for your first step.
                      </p>
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => router.push("/courses")}
                          className="bg-orange hover:bg-orange/90"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Browse Courses
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => router.push("/resources")}
                        >
                          <Award className="h-4 w-4 mr-2" />
                          View Resources
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
