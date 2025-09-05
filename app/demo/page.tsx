"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  GraduationCap,
  Zap,
  Users,
  TrendingUp,
  Star,
  School,
  FileText,
  Map,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Play,
  Palette,
  Sun,
  Moon,
  Monitor,
  Rocket,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Globe,
  Smartphone,
  Tablet,
  Laptop,
} from "lucide-react";

export default function DemoPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const demoData = {
    user: {
      name: "Sonu Sid.",
      avatar: "AJ",
      assessment: {
        completed: true,
        score: 92,
        date: "Dec 15, 2024",
      },
    },
    careerMatches: [
      {
        career: "Software Developer",
        match: 95,
        salary: "₹8-15 LPA",
        growth: "High Growth",
        skills: ["JavaScript", "React", "Node.js", "Problem Solving"],
      },
      {
        career: "Data Scientist",
        match: 88,
        salary: "₹10-18 LPA",
        growth: "Very High Growth",
        skills: ["Python", "Machine Learning", "Statistics", "SQL"],
      },
      {
        career: "Product Manager",
        match: 82,
        salary: "₹12-25 LPA",
        growth: "High Growth",
        skills: ["Strategy", "Communication", "Analytics", "Leadership"],
      },
    ],
    colleges: [
      {
        name: "IIT Delhi",
        type: "IIT",
        ranking: 2,
        fees: "₹2.5L/year",
        match: 98,
      },
      {
        name: "BITS Pilani",
        type: "Private",
        ranking: 15,
        fees: "₹4.5L/year",
        match: 89,
      },
    ],
    exams: [
      {
        name: "JEE Main",
        type: "Engineering",
        date: "Jan-Apr 2025",
        status: "Applications Open",
      },
      {
        name: "CUET UG",
        type: "General",
        date: "May-Jun 2025",
        status: "Opening Soon",
      },
    ],
  };

  const sections = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "assessment", label: "Assessment Report", icon: Brain },
    { id: "careers", label: "Career Matches", icon: Briefcase },
    { id: "colleges", label: "College Explorer", icon: School },
    { id: "features", label: "Key Features", icon: Star },
    { id: "themes", label: "Theme System", icon: Palette },
  ];

  const features = [
    {
      title: "AI-Powered Assessment",
      description:
        "Get personalized career recommendations based on advanced AI analysis",
      icon: Brain,
      color: "from-blue-500 to-purple-600",
      demo: "Interactive assessment with 50+ questions",
    },
    {
      title: "Career Path Mapping",
      description: "Visualize your journey from education to your dream career",
      icon: Map,
      color: "from-green-500 to-teal-600",
      demo: "Step-by-step roadmaps with timelines",
    },
    {
      title: "College & Exam Explorer",
      description:
        "Discover top colleges and entrance exams tailored to your goals",
      icon: School,
      color: "from-orange-500 to-red-600",
      demo: "1000+ colleges and 50+ entrance exams",
    },
    {
      title: "Skill Development",
      description:
        "Identify skill gaps and get personalized learning recommendations",
      icon: Zap,
      color: "from-purple-500 to-pink-600",
      demo: "Curated learning paths and resources",
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor your progress and stay motivated on your career journey",
      icon: TrendingUp,
      color: "from-teal-500 to-blue-600",
      demo: "Visual progress indicators and milestones",
    },
    {
      title: "Expert Guidance",
      description:
        "Access resources and guidance from career counseling experts",
      icon: Users,
      color: "from-indigo-500 to-purple-600",
      demo: "Curated advice and industry insights",
    },
  ];

  const handleSectionChange = (section: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsAnimating(false);
    }, 150);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange/5 via-background to-purple/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-orange flex items-center justify-center text-white shadow-2xl">
              <GraduationCap className="h-8 w-8 bg-orange" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-orange">Skill Bridge</h1>
              <p className="text-lg text-muted-foreground">
                AI Career Platform Demo
              </p>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bridge the gap between education and career success with our
            comprehensive AI-powered platform
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              ✨ Complete Rebranding
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              🎨 Theme System
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              📱 Mobile Optimized
            </Badge>
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              🚀 Enhanced UI/UX
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="flex space-x-1 bg-muted rounded-lg p-1 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  activeSection === section.id
                    ? "bg-white shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <section.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div
          className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
        >
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-orange/10 to-orange/5 border-orange/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Rocket className="h-6 w-6 text-orange" />
                      <span>Platform Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/50 rounded-lg">
                        <div className="text-2xl font-bold text-orange">
                          1000+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Colleges
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          50+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Exams
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          200+
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Careers
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          AI
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Powered
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-orange hover:bg-orange/90 text-white"
                      onClick={() => router.push("/career-assessment")}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Your Journey
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-6 w-6 text-orange" />
                      <span>User Experience</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange to-orange/80 flex items-center justify-center text-white font-bold">
                            {demoData.user.avatar}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {demoData.user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Demo User
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Assessment Progress
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Completed
                          </span>
                        </div>
                        <Progress value={100} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Profile Completion
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {demoData.user.assessment.score}%
                          </span>
                        </div>
                        <Progress
                          value={demoData.user.assessment.score}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Device Compatibility */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    Cross-Platform Compatibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    <div className="space-y-3">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <Smartphone className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold">Mobile First</h3>
                      <p className="text-sm text-muted-foreground">
                        Optimized for mobile devices with touch-friendly
                        interface
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                        <Tablet className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold">Tablet Ready</h3>
                      <p className="text-sm text-muted-foreground">
                        Perfect experience on tablets and medium screens
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                        <Laptop className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold">Desktop Power</h3>
                      <p className="text-sm text-muted-foreground">
                        Full-featured experience on desktop computers
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                        <Globe className="h-8 w-8 text-orange-600" />
                      </div>
                      <h3 className="font-semibold">Web Native</h3>
                      <p className="text-sm text-muted-foreground">
                        Works on all modern browsers with PWA support
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Assessment Report Section */}
          {activeSection === "assessment" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-6 w-6 text-orange" />
                    <span>AI-Powered Assessment Report</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Assessment Features</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>50+ Scientific Questions</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Personality Type Analysis</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Interest & Skill Mapping</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Career Match Scoring</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Report Sections</h3>
                      <div className="space-y-2">
                        {[
                          "Overview",
                          "Career Matches",
                          "Skills & Growth",
                          "Action Plan",
                        ].map((section, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-muted rounded"
                          >
                            <span className="text-sm">{section}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Sample Results</h3>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {demoData.user.assessment.score}%
                          </div>
                          <div className="text-sm text-green-700">
                            Overall Match Score
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <Button
                      className="w-full sm:w-auto bg-orange hover:bg-orange/90 text-white"
                      onClick={() => router.push("/assessment-report")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Sample Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Career Matches Section */}
          {activeSection === "careers" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demoData.careerMatches.map((career, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {career.career}
                        </CardTitle>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {career.match}% Match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={career.match} className="h-2" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Salary Range
                          </span>
                          <div className="font-semibold">{career.salary}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Growth</span>
                          <div className="font-semibold text-green-600">
                            {career.growth}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-muted-foreground">
                          Key Skills
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {career.skills.map((skill, skillIndex) => (
                            <Badge
                              key={skillIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" variant="outline">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Explore Career Path
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* College Explorer Section */}
          {activeSection === "colleges" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <School className="h-6 w-6 text-orange" />
                      <span>College Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {demoData.colleges.map((college, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:border-orange/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{college.name}</h3>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            #{college.ranking} NIRF
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type</span>
                            <div className="font-medium">{college.type}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Fees</span>
                            <div className="font-medium">{college.fees}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Match Score</span>
                            <span className="text-sm font-medium text-green-600">
                              {college.match}%
                            </span>
                          </div>
                          <Progress value={college.match} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-6 w-6 text-orange" />
                      <span>Entrance Exams</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {demoData.exams.map((exam, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{exam.name}</h3>
                          <Badge
                            className={
                              exam.status === "Applications Open"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }
                          >
                            {exam.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type</span>
                            <div className="font-medium">{exam.type}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Exam Date
                            </span>
                            <div className="font-medium">{exam.date}</div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => router.push("/college-exam-explorer")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Explore All Colleges & Exams
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Key Features Section */}
          {activeSection === "features" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div
                      className={`h-12 w-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">{feature.demo}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Theme System Section */}
          {activeSection === "themes" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-6 w-6 text-orange" />
                    <span>Theme System Demo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card
                      className={`cursor-pointer transition-all ${theme === "light" ? "ring-2 ring-orange" : ""}`}
                      onClick={() => setTheme("light")}
                    >
                      <CardContent className="p-6 text-center">
                        <Sun className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                        <h3 className="font-semibold mb-2">Light Theme</h3>
                        <p className="text-sm text-muted-foreground">
                          Clean and bright interface for day time use
                        </p>
                        {theme === "light" && (
                          <Badge className="mt-3 bg-orange text-white">
                            Current
                          </Badge>
                        )}
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all ${theme === "dark" ? "ring-2 ring-orange" : ""}`}
                      onClick={() => setTheme("dark")}
                    >
                      <CardContent className="p-6 text-center">
                        <Moon className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                        <h3 className="font-semibold mb-2">Dark Theme</h3>
                        <p className="text-sm text-muted-foreground">
                          Easy on the eyes for night time use
                        </p>
                        {theme === "dark" && (
                          <Badge className="mt-3 bg-orange text-white">
                            Current
                          </Badge>
                        )}
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all ${theme === "system" ? "ring-2 ring-orange" : ""}`}
                      onClick={() => setTheme("system")}
                    >
                      <CardContent className="p-6 text-center">
                        <Monitor className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                        <h3 className="font-semibold mb-2">System Theme</h3>
                        <p className="text-sm text-muted-foreground">
                          Automatically matches your system preference
                        </p>
                        {theme === "system" && (
                          <Badge className="mt-3 bg-orange text-white">
                            Current
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-orange/10 to-orange/5 rounded-lg border border-orange/20">
                    <h3 className="font-semibold mb-4">Theme Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Seamless theme switching</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>System preference detection</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Consistent across all components</span>
                        </li>
                      </ul>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Mobile-optimized theme toggle</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Persistent user preference</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Smooth transitions</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-orange/10 via-orange/5 to-purple/10 border-orange/20">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Bridge Your Future?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of students who have successfully navigated
                  their career journey with Skill Bridge
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-orange hover:bg-orange/90 text-white"
                    onClick={() => router.push("/career-assessment")}
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    Start Free Assessment
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push("/college-exam-explorer")}
                  >
                    <School className="h-5 w-5 mr-2" />
                    Explore Colleges
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p className="mb-4">
            &copy; 2024 Skill Bridge. Empowering careers through AI-driven
            education guidance.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-orange transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-orange transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-orange transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
