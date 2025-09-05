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
  BookOpen,
  Clock,
  Star,
  Users,
  Play,
  ExternalLink,
  Filter,
  Search,
  Award,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Course {
  id: string;
  title: string;
  description: string;
  provider: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  students: number;
  price: number;
  currency: string;
  imageUrl: string;
  skills: string[];
  category: string;
  url: string;
  certificate: boolean;
  relevanceScore?: number;
}

interface AssessmentResult {
  topCareerMatches: Array<{
    career: string;
    matchPercentage: number;
    requiredSkills: string[];
  }>;
  skillGaps: string[];
  recommendedLearningPath: string[];
}

export default function CoursesPage() {
  const { user, profileCompleted, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
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
            generatePersonalizedCourses(userData.assessmentResults);
          } else {
            setHasCompletedAssessment(false);
            loadDefaultCourses();
          }
        }
      } catch (error) {
        console.error("Error loading assessment results:", error);
        loadDefaultCourses();
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

  const generatePersonalizedCourses = async (results: AssessmentResult) => {
    // Generate personalized courses based on assessment results
    const personalizedCourses: Course[] = [
      // Data Science Track
      {
        id: "ds-python",
        title: "Python for Data Science",
        description:
          "Master Python programming for data analysis, visualization, and machine learning.",
        provider: "DataCamp",
        duration: "40 hours",
        difficulty: "Beginner",
        rating: 4.7,
        students: 45000,
        price: 49,
        currency: "USD",
        imageUrl: "/api/placeholder/300/200",
        skills: ["Python", "Data Analysis", "Pandas", "NumPy"],
        category: "Data Science",
        url: "https://datacamp.com",
        certificate: true,
        relevanceScore: 95,
      },
      {
        id: "ml-fundamentals",
        title: "Machine Learning Fundamentals",
        description:
          "Learn the core concepts of machine learning with hands-on projects.",
        provider: "Coursera",
        duration: "60 hours",
        difficulty: "Intermediate",
        rating: 4.8,
        students: 32000,
        price: 79,
        currency: "USD",
        imageUrl: "/api/placeholder/300/200",
        skills: ["Machine Learning", "Statistics", "Python", "Scikit-learn"],
        category: "Data Science",
        url: "https://coursera.org",
        certificate: true,
        relevanceScore: 90,
      },
      // Software Development Track
      {
        id: "react-development",
        title: "Complete React Developer Course",
        description:
          "Build modern web applications with React, Redux, and TypeScript.",
        provider: "Udemy",
        duration: "50 hours",
        difficulty: "Intermediate",
        rating: 4.6,
        students: 28000,
        price: 89,
        currency: "USD",
        imageUrl: "/api/placeholder/300/200",
        skills: ["React", "JavaScript", "TypeScript", "Redux"],
        category: "Web Development",
        url: "https://udemy.com",
        certificate: true,
        relevanceScore: 88,
      },
      // Business Track
      {
        id: "digital-marketing",
        title: "Digital Marketing Strategy",
        description:
          "Learn to create and execute effective digital marketing campaigns.",
        provider: "LinkedIn Learning",
        duration: "25 hours",
        difficulty: "Beginner",
        rating: 4.5,
        students: 18000,
        price: 39,
        currency: "USD",
        imageUrl: "/api/placeholder/300/200",
        skills: ["Digital Marketing", "SEO", "Social Media", "Analytics"],
        category: "Marketing",
        url: "https://linkedin.com/learning",
        certificate: true,
        relevanceScore: 85,
      },
      // Design Track
      {
        id: "ux-design",
        title: "UX/UI Design Masterclass",
        description:
          "Design user-friendly interfaces and create amazing user experiences.",
        provider: "Figma Academy",
        duration: "35 hours",
        difficulty: "Beginner",
        rating: 4.9,
        students: 22000,
        price: 69,
        currency: "USD",
        imageUrl: "/api/placeholder/300/200",
        skills: ["UX Design", "UI Design", "Figma", "Prototyping"],
        category: "Design",
        url: "https://figma.com",
        certificate: true,
        relevanceScore: 82,
      },
      // Cloud Computing Track
      {
        id: "aws-fundamentals",
        title: "AWS Cloud Practitioner",
        description:
          "Get started with Amazon Web Services and cloud computing concepts.",
        provider: "AWS Training",
        duration: "20 hours",
        difficulty: "Beginner",
        rating: 4.4,
        students: 15000,
        price: 199,
        currency: "USD",
        imageUrl: "/api/placeholder/300/200",
        skills: ["AWS", "Cloud Computing", "DevOps", "Infrastructure"],
        category: "Cloud Computing",
        url: "https://aws.amazon.com/training",
        certificate: true,
        relevanceScore: 78,
      },
    ];

    // Filter and sort courses based on assessment results
    const relevantSkills = results.topCareerMatches.flatMap(
      (match) => match.requiredSkills,
    );
    const skillGaps = results.skillGaps || [];

    const scoredCourses = personalizedCourses.map((course) => {
      let score = 0;

      // Higher score for courses that fill skill gaps
      skillGaps.forEach((gap) => {
        if (
          course.skills.some((skill) =>
            skill.toLowerCase().includes(gap.toLowerCase()),
          )
        ) {
          score += 20;
        }
      });

      // Score for relevant skills
      relevantSkills.forEach((skill) => {
        if (
          course.skills.some((courseSkill) =>
            courseSkill.toLowerCase().includes(skill.toLowerCase()),
          )
        ) {
          score += 10;
        }
      });

      return { ...course, relevanceScore: score };
    });

    const sortedCourses = scoredCourses.sort(
      (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0),
    );
    setCourses(sortedCourses);
    setFilteredCourses(sortedCourses);
  };

  const loadDefaultCourses = () => {
    const defaultCourses: Course[] = [
      {
        id: "programming-basics",
        title: "Programming Fundamentals",
        description:
          "Learn the basics of programming with multiple languages and concepts.",
        provider: "freeCodeCamp",
        duration: "30 hours",
        difficulty: "Beginner",
        rating: 4.6,
        students: 50000,
        price: 0,
        currency: "USD",
        imageUrl: "/api/placeholder/300/200",
        skills: ["Programming", "Logic", "Problem Solving"],
        category: "Programming",
        url: "https://freecodecamp.org",
        certificate: true,
      },
      {
        id: "business-basics",
        title: "Introduction to Business",
        description: "Understand fundamental business concepts and principles.",
        provider: "Khan Academy",
        duration: "20 hours",
        difficulty: "Beginner",
        rating: 4.3,
        students: 25000,
        price: 0,
        currency: "USD",
        imageUrl: "/api/placeholder/300/200",
        skills: ["Business", "Management", "Strategy"],
        category: "Business",
        url: "https://khanacademy.org",
        certificate: false,
      },
    ];

    setCourses(defaultCourses);
    setFilteredCourses(defaultCourses);
  };

  useEffect(() => {
    const filterCourses = () => {
      let filtered = courses;

      if (searchTerm) {
        filtered = filtered.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            course.skills.some((skill) =>
              skill.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        );
      }

      if (selectedCategory !== "all") {
        filtered = filtered.filter(
          (course) => course.category === selectedCategory,
        );
      }

      if (selectedDifficulty !== "all") {
        filtered = filtered.filter(
          (course) => course.difficulty === selectedDifficulty,
        );
      }

      setFilteredCourses(filtered);
    };

    filterCourses();
  }, [searchTerm, selectedCategory, selectedDifficulty, courses]);

  const categories = [
    "all",
    ...new Set(courses.map((course) => course.category)),
  ];
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Course Explorer</h1>
        <p className="text-muted-foreground">
          Discover courses tailored to your career goals and interests
        </p>
      </div>

      {/* Assessment Check */}
      {!hasCompletedAssessment && (
        <Card className="mb-8 border-orange/20 bg-orange/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-6 w-6 text-orange mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  Get Personalized Course Recommendations
                </h3>
                <p className="text-muted-foreground mb-4">
                  Complete your career assessment to get personalized course
                  recommendations based on your interests, skills, and career
                  goals.
                </p>
                <Button
                  onClick={() => router.push("/career-assessment")}
                  className="bg-orange hover:bg-orange/90"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Take Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
        >
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty === "all" ? "All Levels" : difficulty}
            </option>
          ))}
        </select>

        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>More Filters</span>
        </Button>
      </div>

      {/* Recommended Courses */}
      {hasCompletedAssessment && assessmentResult && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-orange" />
            <h2 className="text-xl font-semibold">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filteredCourses
              .filter((course) => (course.relevanceScore || 0) > 70)
              .slice(0, 3)
              .map((course) => (
                <CourseCard key={course.id} course={course} isRecommended />
              ))}
          </div>
        </div>
      )}

      {/* All Courses */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">
          {hasCompletedAssessment ? "More Courses" : "Popular Courses"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or explore different categories.
          </p>
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course,
  isRecommended = false,
}: {
  course: Course;
  isRecommended?: boolean;
}) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-orange/10 to-orange/20 rounded-t-lg flex items-center justify-center">
          <BookOpen className="h-16 w-16 text-orange/50" />
        </div>
        {isRecommended && (
          <Badge className="absolute top-2 right-2 bg-orange text-white">
            Recommended
          </Badge>
        )}
        {course.relevanceScore && course.relevanceScore > 80 && (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
            {course.relevanceScore}% Match
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="mb-2">
            {course.category}
          </Badge>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{course.rating}</span>
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="outline">{course.difficulty}</Badge>
            <div className="flex items-center space-x-1">
              <span className="font-semibold">
                {course.price === 0 ? "Free" : `$${course.price}`}
              </span>
              {course.certificate && <Award className="h-4 w-4 text-orange" />}
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {course.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {course.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{course.skills.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex space-x-2 pt-2">
            <Button size="sm" className="flex-1" asChild>
              <a href={course.url} target="_blank" rel="noopener noreferrer">
                <Play className="h-4 w-4 mr-2" />
                Enroll Now
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={course.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
