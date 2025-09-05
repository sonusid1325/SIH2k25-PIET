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
  FileText,
  Video,
  Download,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  Users,
  AlertCircle,
  Award,
  TrendingUp,
  Bookmark,
  Share,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

interface Resource {
  id: string;
  title: string;
  description: string;
  type:
    | "guide"
    | "template"
    | "tool"
    | "article"
    | "video"
    | "ebook"
    | "checklist";
  category: string;
  tags: string[];
  author: string;
  publishedDate: string;
  readTime?: string;
  downloadUrl?: string;
  externalUrl?: string;
  isPremium: boolean;
  rating: number;
  downloads: number;
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

export default function ResourcesPage() {
  const { user, profileCompleted, loading } = useAuth();
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
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
            generatePersonalizedResources(userData.assessmentResults);
          } else {
            setHasCompletedAssessment(false);
            loadDefaultResources();
          }
        }
      } catch (error) {
        console.error("Error loading assessment results:", error);
        loadDefaultResources();
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

  const generatePersonalizedResources = async (results: AssessmentResult) => {
    const personalizedResources: Resource[] = [
      // Career Planning Resources
      {
        id: "career-roadmap-template",
        title: "Personalized Career Roadmap Template",
        description:
          "A comprehensive template to plan your career progression with actionable steps and milestones.",
        type: "template",
        category: "Career Planning",
        tags: ["career-planning", "roadmap", "goals", "strategy"],
        author: "Career Experts Team",
        publishedDate: "2024-01-15",
        readTime: "30 min",
        downloadUrl: "/resources/career-roadmap-template.pdf",
        isPremium: false,
        rating: 4.8,
        downloads: 15420,
        relevanceScore: 95,
      },
      {
        id: "skill-gap-analyzer",
        title: "Skills Gap Analysis Worksheet",
        description:
          "Identify and bridge the gaps between your current skills and career requirements.",
        type: "tool",
        category: "Skill Development",
        tags: ["skills", "analysis", "development", "assessment"],
        author: "Dr. Sarah Johnson",
        publishedDate: "2024-01-10",
        readTime: "45 min",
        downloadUrl: "/resources/skill-gap-analyzer.xlsx",
        isPremium: false,
        rating: 4.6,
        downloads: 8930,
        relevanceScore: 90,
      },
      // Interview Preparation
      {
        id: "interview-prep-guide",
        title: "Complete Interview Preparation Guide",
        description:
          "Master job interviews with proven strategies, common questions, and expert tips.",
        type: "guide",
        category: "Job Search",
        tags: ["interview", "preparation", "questions", "tips"],
        author: "Marcus Chen",
        publishedDate: "2024-01-08",
        readTime: "2 hours",
        downloadUrl: "/resources/interview-prep-guide.pdf",
        isPremium: false,
        rating: 4.9,
        downloads: 23100,
        relevanceScore: 85,
      },
      // Resume Resources
      {
        id: "ats-resume-template",
        title: "ATS-Friendly Resume Templates",
        description:
          "Professional resume templates optimized for Applicant Tracking Systems.",
        type: "template",
        category: "Job Search",
        tags: ["resume", "template", "ats", "professional"],
        author: "HR Insights Team",
        publishedDate: "2024-01-12",
        readTime: "20 min",
        downloadUrl: "/resources/ats-resume-templates.zip",
        isPremium: false,
        rating: 4.7,
        downloads: 31250,
        relevanceScore: 88,
      },
      // Industry-Specific Resources
      {
        id: "tech-industry-guide",
        title: "Breaking into Tech: Complete Guide",
        description:
          "Everything you need to know about starting a career in technology.",
        type: "ebook",
        category: "Industry Guides",
        tags: ["technology", "career-change", "tech-industry", "guide"],
        author: "Tech Career Collective",
        publishedDate: "2024-01-05",
        readTime: "3 hours",
        downloadUrl: "/resources/tech-industry-guide.pdf",
        isPremium: true,
        rating: 4.8,
        downloads: 12400,
        relevanceScore: 82,
      },
      // Networking Resources
      {
        id: "networking-masterclass",
        title: "Professional Networking Masterclass",
        description:
          "Build meaningful professional relationships and expand your network effectively.",
        type: "video",
        category: "Professional Development",
        tags: ["networking", "relationships", "professional", "career"],
        author: "LinkedIn Learning",
        publishedDate: "2024-01-03",
        readTime: "90 min",
        externalUrl: "https://linkedin.com/learning/networking",
        isPremium: false,
        rating: 4.5,
        downloads: 9870,
        relevanceScore: 78,
      },
      // Salary Negotiation
      {
        id: "salary-negotiation-toolkit",
        title: "Salary Negotiation Toolkit",
        description:
          "Scripts, strategies, and templates to negotiate your worth confidently.",
        type: "tool",
        category: "Career Advancement",
        tags: ["salary", "negotiation", "compensation", "career-growth"],
        author: "Negotiation Experts",
        publishedDate: "2024-01-01",
        readTime: "1 hour",
        downloadUrl: "/resources/salary-negotiation-toolkit.pdf",
        isPremium: false,
        rating: 4.6,
        downloads: 18750,
        relevanceScore: 80,
      },
      // Personal Branding
      {
        id: "personal-branding-checklist",
        title: "Personal Branding Checklist",
        description:
          "Build a strong professional brand across all platforms and touchpoints.",
        type: "checklist",
        category: "Professional Development",
        tags: [
          "personal-branding",
          "linkedin",
          "professional-image",
          "marketing",
        ],
        author: "Brand Strategy Pro",
        publishedDate: "2023-12-28",
        readTime: "45 min",
        downloadUrl: "/resources/personal-branding-checklist.pdf",
        isPremium: false,
        rating: 4.4,
        downloads: 14320,
        relevanceScore: 75,
      },
      // Leadership Resources
      {
        id: "leadership-development-plan",
        title: "Leadership Development Action Plan",
        description:
          "Develop your leadership skills with a structured 90-day action plan.",
        type: "template",
        category: "Leadership",
        tags: ["leadership", "development", "management", "skills"],
        author: "Leadership Institute",
        publishedDate: "2023-12-25",
        readTime: "2 hours",
        downloadUrl: "/resources/leadership-development-plan.pdf",
        isPremium: true,
        rating: 4.7,
        downloads: 7890,
        relevanceScore: 73,
      },
      // Remote Work Resources
      {
        id: "remote-work-success-guide",
        title: "Remote Work Success Guide",
        description:
          "Master remote work with productivity tips, tools, and best practices.",
        type: "guide",
        category: "Work-Life Balance",
        tags: [
          "remote-work",
          "productivity",
          "work-from-home",
          "digital-nomad",
        ],
        author: "Remote Work Hub",
        publishedDate: "2023-12-22",
        readTime: "1.5 hours",
        downloadUrl: "/resources/remote-work-success-guide.pdf",
        isPremium: false,
        rating: 4.3,
        downloads: 11240,
        relevanceScore: 70,
      },
    ];

    // Filter and sort resources based on assessment results
    const skillGaps = results.skillGaps || [];
    const careerFields = results.topCareerMatches.map((match) => match.career);

    const scoredResources = personalizedResources.map((resource) => {
      let score = resource.relevanceScore || 0;

      // Higher score for resources that address skill gaps
      skillGaps.forEach((gap) => {
        if (
          resource.tags.some((tag) =>
            tag.toLowerCase().includes(gap.toLowerCase()),
          ) ||
          resource.title.toLowerCase().includes(gap.toLowerCase())
        ) {
          score += 15;
        }
      });

      // Score for career field relevance
      careerFields.forEach((career) => {
        if (
          resource.tags.some((tag) =>
            career.toLowerCase().includes(tag.toLowerCase()),
          ) ||
          resource.description.toLowerCase().includes(career.toLowerCase())
        ) {
          score += 10;
        }
      });

      return { ...resource, relevanceScore: score };
    });

    const sortedResources = scoredResources.sort(
      (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0),
    );
    setResources(sortedResources);
    setFilteredResources(sortedResources);
  };

  const loadDefaultResources = () => {
    const defaultResources: Resource[] = [
      {
        id: "career-starter-kit",
        title: "Career Starter Kit",
        description: "Essential resources to kickstart your career journey.",
        type: "guide",
        category: "Career Planning",
        tags: ["career", "beginner", "planning", "guide"],
        author: "Career Coaches",
        publishedDate: "2024-01-01",
        readTime: "1 hour",
        downloadUrl: "/resources/career-starter-kit.pdf",
        isPremium: false,
        rating: 4.5,
        downloads: 25000,
      },
      {
        id: "job-search-basics",
        title: "Job Search Fundamentals",
        description:
          "Learn the basics of effective job searching and application strategies.",
        type: "article",
        category: "Job Search",
        tags: ["job-search", "applications", "strategy"],
        author: "Job Search Pro",
        publishedDate: "2024-01-01",
        readTime: "30 min",
        externalUrl: "https://example.com/job-search-basics",
        isPremium: false,
        rating: 4.2,
        downloads: 15000,
      },
    ];

    setResources(defaultResources);
    setFilteredResources(defaultResources);
  };

  useEffect(() => {
    const filterResources = () => {
      let filtered = resources;

      if (searchTerm) {
        filtered = filtered.filter(
          (resource) =>
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            resource.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        );
      }

      if (selectedCategory !== "all") {
        filtered = filtered.filter(
          (resource) => resource.category === selectedCategory,
        );
      }

      if (selectedType !== "all") {
        filtered = filtered.filter(
          (resource) => resource.type === selectedType,
        );
      }

      setFilteredResources(filtered);
    };

    filterResources();
  }, [searchTerm, selectedCategory, selectedType, resources]);

  const categories = [
    "all",
    ...new Set(resources.map((resource) => resource.category)),
  ];
  const types = [
    "all",
    "guide",
    "template",
    "tool",
    "article",
    "video",
    "ebook",
    "checklist",
  ];

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
        <h1 className="text-3xl font-bold mb-2">Career Resources</h1>
        <p className="text-muted-foreground">
          Access tools, guides, and materials to advance your career
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
                  Get Personalized Resource Recommendations
                </h3>
                <p className="text-muted-foreground mb-4">
                  Complete your career assessment to get personalized resource
                  recommendations based on your career goals and skill gaps.
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
            placeholder="Search resources..."
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
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type === "all"
                ? "All Types"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>More Filters</span>
        </Button>
      </div>

      {/* Recommended Resources */}
      {hasCompletedAssessment && assessmentResult && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-orange" />
            <h2 className="text-xl font-semibold">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filteredResources
              .filter((resource) => (resource.relevanceScore || 0) > 80)
              .slice(0, 3)
              .map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  isRecommended
                />
              ))}
          </div>
        </div>
      )}

      {/* All Resources */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">
          {hasCompletedAssessment ? "More Resources" : "Popular Resources"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No resources found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or explore different categories.
          </p>
        </div>
      )}
    </div>
  );
}

function ResourceCard({
  resource,
  isRecommended = false,
}: {
  resource: Resource;
  isRecommended?: boolean;
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "guide":
        return <BookOpen className="h-4 w-4" />;
      case "template":
        return <FileText className="h-4 w-4" />;
      case "tool":
        return <Award className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "ebook":
        return <BookOpen className="h-4 w-4" />;
      case "checklist":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleDownload = () => {
    if (resource.downloadUrl) {
      // In a real app, this would trigger a download
      console.log("Downloading:", resource.title);
    } else if (resource.externalUrl) {
      window.open(resource.externalUrl, "_blank");
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon(resource.type)}
            <Badge variant="secondary">
              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {isRecommended && (
              <Badge className="bg-orange text-white">Recommended</Badge>
            )}
            {resource.isPremium && (
              <Badge className="bg-yellow-500 text-white">Premium</Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {resource.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{resource.author}</span>
            </div>
            {resource.readTime && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{resource.readTime}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <Badge variant="outline">{resource.category}</Badge>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500">★</span>
              <span>{resource.rating}</span>
              <span className="text-muted-foreground">
                ({resource.downloads.toLocaleString()})
              </span>
            </div>
          </div>

          {resource.relevanceScore && resource.relevanceScore > 70 && (
            <div className="flex items-center space-x-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600 font-medium">
                {resource.relevanceScore}% Relevant
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{resource.tags.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex space-x-2 pt-2">
            <Button size="sm" className="flex-1" onClick={handleDownload}>
              {resource.downloadUrl ? (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </>
              )}
            </Button>
            <Button size="sm" variant="outline">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
