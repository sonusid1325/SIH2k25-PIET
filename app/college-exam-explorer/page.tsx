"use client";

import { useEffect, useState, useCallback } from "react";
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
  School,
  MapPin,
  Calendar,
  ExternalLink,
  Search,
  Filter,
  Users,
  Award,
  AlertCircle,
  Target,
  CheckCircle,
  GraduationCap,
  FileText,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { AssessmentService } from "@/lib/services/assessmentService";

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  type:
    | "IIT"
    | "NIT"
    | "IIIT"
    | "Government"
    | "Central University"
    | "State University";
  courses: string[];
  nirf_ranking?: number;
  fees: string;
  seats: number;
  cutoff: string;
  website: string;
  established: number;
  accreditation: string[];
  facilities: string[];
  relevanceScore?: number;
}

interface Exam {
  id: string;
  name: string;
  fullName: string;
  type: "Engineering" | "Medical" | "Management" | "General" | "Law" | "Other";
  conductedBy: string;
  applicationStart: string;
  applicationEnd: string;
  examDate: string;
  resultDate: string;
  eligibility: string;
  pattern: string;
  syllabus: string[];
  website: string;
  fees: string;
  isRecommended?: boolean;
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
  personalityType: string;
  interests: string[];
}

export default function CollegeExamExplorerPage() {
  const { user, profileCompleted, loading } = useAuth();
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"colleges" | "exams">("colleges");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

  const loadAssessmentResults = useCallback(async () => {
    if (!user) return;

    try {
      const results = await AssessmentService.getAssessmentResults(user.uid);
      if (results) {
        setAssessmentResult(results);
        setHasCompletedAssessment(true);
        generatePersonalizedRecommendations(results);
      } else {
        setHasCompletedAssessment(false);
        loadDefaultData();
      }
    } catch (error) {
      console.error("Error loading assessment results:", error);
      loadDefaultData();
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
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
  }, [user, profileCompleted, loading, router, loadAssessmentResults]);

  const generatePersonalizedRecommendations = (results: AssessmentResult) => {
    // Generate personalized college and exam recommendations based on career matches
    const topCareers = results.topCareerMatches.map((match) =>
      match.career.toLowerCase(),
    );
    const isSTEM = topCareers.some(
      (career) =>
        career.includes("engineer") ||
        career.includes("developer") ||
        career.includes("scientist") ||
        career.includes("data"),
    );
    const isBusiness = topCareers.some(
      (career) =>
        career.includes("business") ||
        career.includes("management") ||
        career.includes("analyst"),
    );
    const isMedical = topCareers.some(
      (career) =>
        career.includes("doctor") ||
        career.includes("medical") ||
        career.includes("health"),
    );

    const personalizedColleges: College[] = [
      // IITs
      {
        id: "iit-delhi",
        name: "Indian Institute of Technology Delhi",
        location: "New Delhi",
        state: "Delhi",
        type: "IIT",
        courses: [
          "Computer Science",
          "Electrical Engineering",
          "Mechanical Engineering",
          "Civil Engineering",
        ],
        nirf_ranking: 2,
        fees: "₹2.5-3 Lakhs/year",
        seats: 1200,
        cutoff: "JEE Advanced Rank 1-500",
        website: "https://home.iitd.ac.in",
        established: 1961,
        accreditation: ["NAAC A++", "NBA"],
        facilities: [
          "Research Labs",
          "Industry Partnerships",
          "International Exchange",
        ],
        relevanceScore: isSTEM ? 95 : 70,
      },
      {
        id: "iit-bombay",
        name: "Indian Institute of Technology Bombay",
        location: "Mumbai",
        state: "Maharashtra",
        type: "IIT",
        courses: [
          "Computer Science",
          "Electronics",
          "Chemical Engineering",
          "Aerospace",
        ],
        nirf_ranking: 3,
        fees: "₹2.5-3 Lakhs/year",
        seats: 1100,
        cutoff: "JEE Advanced Rank 1-400",
        website: "https://www.iitb.ac.in",
        established: 1958,
        accreditation: ["NAAC A++", "NBA"],
        facilities: ["Innovation Hub", "Startup Incubator", "Research Centers"],
        relevanceScore: isSTEM ? 98 : 75,
      },
      // NITs
      {
        id: "nit-trichy",
        name: "National Institute of Technology Tiruchirappalli",
        location: "Tiruchirappalli",
        state: "Tamil Nadu",
        type: "NIT",
        courses: [
          "Computer Science",
          "Electronics",
          "Mechanical",
          "Chemical Engineering",
        ],
        nirf_ranking: 8,
        fees: "₹1.5-2 Lakhs/year",
        seats: 800,
        cutoff: "JEE Main Rank 500-5000",
        website: "https://www.nitt.edu",
        established: 1964,
        accreditation: ["NAAC A+", "NBA"],
        facilities: ["Central Library", "Industry Interface", "Sports Complex"],
        relevanceScore: isSTEM ? 88 : 65,
      },
      // Central Universities
      {
        id: "du",
        name: "University of Delhi",
        location: "New Delhi",
        state: "Delhi",
        type: "Central University",
        courses: [
          "Economics",
          "Political Science",
          "Commerce",
          "English",
          "Mathematics",
        ],
        nirf_ranking: 12,
        fees: "₹20,000-50,000/year",
        seats: 3000,
        cutoff: "CUET Score 650+",
        website: "https://www.du.ac.in",
        established: 1922,
        accreditation: ["NAAC A++"],
        facilities: [
          "Multiple Colleges",
          "Research Departments",
          "Cultural Centers",
        ],
        relevanceScore: isBusiness ? 85 : isSTEM ? 70 : 80,
      },
      {
        id: "jnu",
        name: "Jawaharlal Nehru University",
        location: "New Delhi",
        state: "Delhi",
        type: "Central University",
        courses: [
          "International Studies",
          "Social Sciences",
          "Languages",
          "Life Sciences",
        ],
        nirf_ranking: 18,
        fees: "₹15,000-40,000/year",
        seats: 1500,
        cutoff: "JNUEE Score based",
        website: "https://www.jnu.ac.in",
        established: 1969,
        accreditation: ["NAAC A++"],
        facilities: [
          "International Programs",
          "Research Centers",
          "Language Schools",
        ],
        relevanceScore: isBusiness ? 75 : 65,
      },
      // Medical Colleges
      {
        id: "aiims-delhi",
        name: "All India Institute of Medical Sciences Delhi",
        location: "New Delhi",
        state: "Delhi",
        type: "Government",
        courses: ["MBBS", "MD", "MS", "Nursing", "Pharmacy"],
        nirf_ranking: 1,
        fees: "₹1,500-5,000/year",
        seats: 100,
        cutoff: "NEET Rank 1-50",
        website: "https://www.aiims.ac.in",
        established: 1956,
        accreditation: ["NAAC A++", "MCI"],
        facilities: [
          "Super Specialty Hospital",
          "Research Institute",
          "Trauma Center",
        ],
        relevanceScore: isMedical ? 100 : 30,
      },
      // State Universities
      {
        id: "anna-university",
        name: "Anna University",
        location: "Chennai",
        state: "Tamil Nadu",
        type: "State University",
        courses: [
          "Engineering",
          "Technology",
          "Architecture",
          "Applied Sciences",
        ],
        nirf_ranking: 25,
        fees: "₹50,000-1 Lakh/year",
        seats: 2000,
        cutoff: "TNEA Rank 1000-10000",
        website: "https://www.annauniv.edu",
        established: 1978,
        accreditation: ["NAAC A+", "NBA"],
        facilities: [
          "Industry Collaboration",
          "Research Parks",
          "Innovation Centers",
        ],
        relevanceScore: isSTEM ? 80 : 60,
      },
    ];

    const personalizedExams: Exam[] = [
      // Engineering Exams
      {
        id: "jee-main",
        name: "JEE Main",
        fullName: "Joint Entrance Examination Main",
        type: "Engineering",
        conductedBy: "NTA",
        applicationStart: "December 2024",
        applicationEnd: "January 2025",
        examDate: "January-April 2025",
        resultDate: "May 2025",
        eligibility: "12th with PCM, 75% aggregate",
        pattern: "Computer Based Test - 300 marks",
        syllabus: ["Physics", "Chemistry", "Mathematics"],
        website: "https://jeemain.nta.nic.in",
        fees: "₹650-3000",
        isRecommended: isSTEM,
        relevanceScore: isSTEM ? 95 : 40,
      },
      {
        id: "jee-advanced",
        name: "JEE Advanced",
        fullName: "Joint Entrance Examination Advanced",
        type: "Engineering",
        conductedBy: "IIT Roorkee",
        applicationStart: "May 2025",
        applicationEnd: "May 2025",
        examDate: "June 2025",
        resultDate: "June 2025",
        eligibility: "JEE Main qualified, Top 2.5 lakh",
        pattern: "Computer Based Test - 2 papers",
        syllabus: ["Physics", "Chemistry", "Mathematics"],
        website: "https://jeeadv.ac.in",
        fees: "₹2800",
        isRecommended: isSTEM,
        relevanceScore: isSTEM ? 90 : 35,
      },
      // Medical Exams
      {
        id: "neet-ug",
        name: "NEET UG",
        fullName: "National Eligibility Entrance Test Undergraduate",
        type: "Medical",
        conductedBy: "NTA",
        applicationStart: "February 2025",
        applicationEnd: "March 2025",
        examDate: "May 2025",
        resultDate: "June 2025",
        eligibility: "12th with PCB, 50% aggregate",
        pattern: "Pen & Paper - 720 marks",
        syllabus: ["Physics", "Chemistry", "Biology"],
        website: "https://neet.nta.nic.in",
        fees: "₹1700-8800",
        isRecommended: isMedical,
        relevanceScore: isMedical ? 100 : 25,
      },
      // General/University Exams
      {
        id: "cuet-ug",
        name: "CUET UG",
        fullName: "Common University Entrance Test Undergraduate",
        type: "General",
        conductedBy: "NTA",
        applicationStart: "March 2025",
        applicationEnd: "April 2025",
        examDate: "May-June 2025",
        resultDate: "July 2025",
        eligibility: "12th pass from recognized board",
        pattern: "Computer Based Test",
        syllabus: ["Domain subjects", "General Test", "Languages"],
        website: "https://cuet.samarth.ac.in",
        fees: "₹650-2750",
        isRecommended: true,
        relevanceScore: 85,
      },
      // Management Exams
      {
        id: "cat",
        name: "CAT",
        fullName: "Common Admission Test",
        type: "Management",
        conductedBy: "IIM",
        applicationStart: "August 2024",
        applicationEnd: "September 2024",
        examDate: "November 2024",
        resultDate: "January 2025",
        eligibility: "Bachelor's degree, 50% aggregate",
        pattern: "Computer Based Test - 3 hours",
        syllabus: ["QA", "VARC", "LRDI"],
        website: "https://iimcat.ac.in",
        fees: "₹2300-4600",
        isRecommended: isBusiness,
        relevanceScore: isBusiness ? 90 : 50,
      },
      {
        id: "cmat",
        name: "CMAT",
        fullName: "Common Management Admission Test",
        type: "Management",
        conductedBy: "NTA",
        applicationStart: "December 2024",
        applicationEnd: "January 2025",
        examDate: "February 2025",
        resultDate: "March 2025",
        eligibility: "Bachelor's degree",
        pattern: "Computer Based Test - 3 hours",
        syllabus: ["QA", "LR", "Language", "General Awareness"],
        website: "https://cmat.nta.nic.in",
        fees: "₹2000",
        isRecommended: isBusiness,
        relevanceScore: isBusiness ? 75 : 40,
      },
    ];

    // Sort by relevance score
    const sortedColleges = personalizedColleges.sort(
      (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0),
    );
    const sortedExams = personalizedExams.sort(
      (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0),
    );

    setColleges(sortedColleges);
    setExams(sortedExams);
    setFilteredColleges(sortedColleges);
    setFilteredExams(sortedExams);
  };

  const loadDefaultData = () => {
    // Load default data when no assessment is completed
    const defaultColleges: College[] = [
      {
        id: "iit-delhi-default",
        name: "Indian Institute of Technology Delhi",
        location: "New Delhi",
        state: "Delhi",
        type: "IIT",
        courses: [
          "Computer Science",
          "Electrical Engineering",
          "Mechanical Engineering",
        ],
        nirf_ranking: 2,
        fees: "₹2.5-3 Lakhs/year",
        seats: 1200,
        cutoff: "JEE Advanced Rank 1-500",
        website: "https://home.iitd.ac.in",
        established: 1961,
        accreditation: ["NAAC A++", "NBA"],
        facilities: ["Research Labs", "Industry Partnerships"],
      },
      {
        id: "du-default",
        name: "University of Delhi",
        location: "New Delhi",
        state: "Delhi",
        type: "Central University",
        courses: ["Economics", "Political Science", "Commerce"],
        nirf_ranking: 12,
        fees: "₹20,000-50,000/year",
        seats: 3000,
        cutoff: "CUET Score 650+",
        website: "https://www.du.ac.in",
        established: 1922,
        accreditation: ["NAAC A++"],
        facilities: ["Multiple Colleges", "Research Departments"],
      },
    ];

    const defaultExams: Exam[] = [
      {
        id: "jee-main-default",
        name: "JEE Main",
        fullName: "Joint Entrance Examination Main",
        type: "Engineering",
        conductedBy: "NTA",
        applicationStart: "December 2024",
        applicationEnd: "January 2025",
        examDate: "January-April 2025",
        resultDate: "May 2025",
        eligibility: "12th with PCM, 75% aggregate",
        pattern: "Computer Based Test - 300 marks",
        syllabus: ["Physics", "Chemistry", "Mathematics"],
        website: "https://jeemain.nta.nic.in",
        fees: "₹650-3000",
      },
      {
        id: "cuet-ug-default",
        name: "CUET UG",
        fullName: "Common University Entrance Test Undergraduate",
        type: "General",
        conductedBy: "NTA",
        applicationStart: "March 2025",
        applicationEnd: "April 2025",
        examDate: "May-June 2025",
        resultDate: "July 2025",
        eligibility: "12th pass from recognized board",
        pattern: "Computer Based Test",
        syllabus: ["Domain subjects", "General Test", "Languages"],
        website: "https://cuet.samarth.ac.in",
        fees: "₹650-2750",
      },
    ];

    setColleges(defaultColleges);
    setExams(defaultExams);
    setFilteredColleges(defaultColleges);
    setFilteredExams(defaultExams);
  };

  const filterData = useCallback(() => {
    if (activeTab === "colleges") {
      let filtered = colleges;

      if (searchTerm) {
        filtered = filtered.filter(
          (college) =>
            college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            college.courses.some((course) =>
              course.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        );
      }

      if (selectedState !== "all") {
        filtered = filtered.filter(
          (college) => college.state === selectedState,
        );
      }

      if (selectedType !== "all") {
        filtered = filtered.filter((college) => college.type === selectedType);
      }

      setFilteredColleges(filtered);
    } else {
      let filtered = exams;

      if (searchTerm) {
        filtered = filtered.filter(
          (exam) =>
            exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.type.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      if (selectedType !== "all") {
        filtered = filtered.filter((exam) => exam.type === selectedType);
      }

      setFilteredExams(filtered);
    }
  }, [searchTerm, selectedState, selectedType, activeTab, colleges, exams]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const states = ["all", ...new Set(colleges.map((college) => college.state))];
  const collegeTypes = [
    "all",
    ...new Set(colleges.map((college) => college.type)),
  ];
  const examTypes = ["all", ...new Set(exams.map((exam) => exam.type))];

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
        <h1 className="text-3xl font-bold mb-2">College & Exam Explorer</h1>
        <p className="text-muted-foreground">
          Discover government colleges and entrance exams tailored to your
          career goals
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
                  Get Personalized College & Exam Recommendations
                </h3>
                <p className="text-muted-foreground mb-4">
                  Complete your career assessment to get personalized
                  recommendations for colleges and entrance exams based on your
                  career goals.
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

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab("colleges")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "colleges"
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <School className="h-4 w-4" />
          Colleges ({filteredColleges.length})
        </button>
        <button
          onClick={() => setActiveTab("exams")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "exams"
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          Exams ({filteredExams.length})
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
          />
        </div>

        {activeTab === "colleges" && (
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state === "all" ? "All States" : state}
              </option>
            ))}
          </select>
        )}

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
        >
          {(activeTab === "colleges" ? collegeTypes : examTypes).map((type) => (
            <option key={type} value={type}>
              {type === "all"
                ? `All ${activeTab === "colleges" ? "Types" : "Categories"}`
                : type}
            </option>
          ))}
        </select>

        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>More Filters</span>
        </Button>
      </div>

      {/* Recommended Section */}
      {hasCompletedAssessment && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-orange" />
            <h2 className="text-xl font-semibold">
              Recommended {activeTab === "colleges" ? "Colleges" : "Exams"} for
              You
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {activeTab === "colleges"
              ? filteredColleges
                  .filter((college) => (college.relevanceScore || 0) > 80)
                  .slice(0, 3)
                  .map((college) => (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      isRecommended
                    />
                  ))
              : filteredExams
                  .filter((exam) => exam.isRecommended)
                  .slice(0, 3)
                  .map((exam) => (
                    <ExamCard key={exam.id} exam={exam} isRecommended />
                  ))}
          </div>
        </div>
      )}

      {/* All Items */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">
          {hasCompletedAssessment
            ? `More ${activeTab === "colleges" ? "Colleges" : "Exams"}`
            : `Popular ${activeTab === "colleges" ? "Colleges" : "Exams"}`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "colleges"
            ? filteredColleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))
            : filteredExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
        </div>
      </div>

      {((activeTab === "colleges" && filteredColleges.length === 0) ||
        (activeTab === "exams" && filteredExams.length === 0)) && (
        <div className="text-center py-12">
          {activeTab === "colleges" ? (
            <School className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          ) : (
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          )}
          <h3 className="text-lg font-semibold mb-2">No {activeTab} found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or explore different categories.
          </p>
        </div>
      )}
    </div>
  );
}

function CollegeCard({
  college,
  isRecommended = false,
}: {
  college: College;
  isRecommended?: boolean;
}) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="secondary">{college.type}</Badge>
            {college.nirf_ranking && (
              <Badge className="bg-yellow-500 text-white">
                NIRF #{college.nirf_ranking}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isRecommended && (
              <Badge className="bg-orange text-white">Recommended</Badge>
            )}
            {college.relevanceScore && college.relevanceScore > 80 && (
              <Badge className="bg-green-500 text-white">
                {college.relevanceScore}% Match
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{college.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {college.location}, {college.state}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>{college.established}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{college.seats} seats</span>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-medium mb-1">Popular Courses:</div>
            <div className="flex flex-wrap gap-1">
              {college.courses.slice(0, 3).map((course, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {course}
                </Badge>
              ))}
              {college.courses.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{college.courses.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-muted-foreground">Fees</div>
              <div>{college.fees}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Cutoff</div>
              <div className="text-xs">{college.cutoff}</div>
            </div>
          </div>

          {college.facilities && college.facilities.length > 0 && (
            <div className="text-sm">
              <div className="font-medium mb-1">Key Facilities:</div>
              <div className="flex flex-wrap gap-1">
                {college.facilities.slice(0, 2).map((facility, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <Button variant="outline" size="sm" asChild>
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Website
              </a>
            </Button>
            <div className="text-right text-xs text-muted-foreground">
              Est. {college.established}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExamCard({
  exam,
  isRecommended = false,
}: {
  exam: Exam;
  isRecommended?: boolean;
}) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Engineering":
        return "bg-blue-500";
      case "Medical":
        return "bg-green-500";
      case "Management":
        return "bg-purple-500";
      case "General":
        return "bg-orange-500";
      case "Law":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getApplicationStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return {
        status: "upcoming",
        text: "Applications Open Soon",
        color: "text-blue-600",
      };
    } else if (now >= start && now <= end) {
      return {
        status: "open",
        text: "Applications Open",
        color: "text-green-600",
      };
    } else {
      return {
        status: "closed",
        text: "Applications Closed",
        color: "text-red-600",
      };
    }
  };

  const applicationStatus = getApplicationStatus(
    exam.applicationStart,
    exam.applicationEnd,
  );

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge className={`${getTypeColor(exam.type)} text-white`}>
            {exam.type}
          </Badge>
          <div className="flex items-center space-x-2">
            {isRecommended && (
              <Badge className="bg-orange text-white">Recommended</Badge>
            )}
            {exam.relevanceScore && exam.relevanceScore > 80 && (
              <Badge className="bg-green-500 text-white">
                {exam.relevanceScore}% Match
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg">{exam.name}</CardTitle>
        <CardDescription className="text-sm">{exam.fullName}</CardDescription>
        <div className={`text-sm font-medium ${applicationStatus.color}`}>
          {applicationStatus.text}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-muted-foreground">
                Conducted By
              </div>
              <div>{exam.conductedBy}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">Exam Date</div>
              <div>{exam.examDate}</div>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-medium text-muted-foreground mb-1">
              Application Period
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {exam.applicationStart} - {exam.applicationEnd}
              </span>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-medium text-muted-foreground mb-1">
              Exam Pattern
            </div>
            <div>{exam.pattern}</div>
          </div>

          <div className="text-sm">
            <div className="font-medium text-muted-foreground mb-1">
              Key Subjects
            </div>
            <div className="flex flex-wrap gap-1">
              {exam.syllabus.slice(0, 3).map((subject, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {subject}
                </Badge>
              ))}
              {exam.syllabus.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{exam.syllabus.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-muted-foreground">
                Application Fees
              </div>
              <div>{exam.fees}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">
                Result Date
              </div>
              <div>{exam.resultDate}</div>
            </div>
          </div>

          <div className="text-sm">
            <div className="font-medium text-muted-foreground mb-1">
              Eligibility
            </div>
            <div className="text-xs">{exam.eligibility}</div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <Button variant="outline" size="sm" asChild>
              <a href={exam.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Official Website
              </a>
            </Button>
            {applicationStatus.status === "open" && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Apply Now
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
