"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  User,
  BookOpen,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { updateProfileCompletion } from "@/lib/firebase/auth";

const courseOptions = [
  { value: "", label: "Select your current status" },
  { value: "10th-completed", label: "10th Class Completed" },
  { value: "10th-appearing", label: "Currently in 10th Class" },
  { value: "12th-completed", label: "12th Class Completed" },
  { value: "12th-appearing", label: "Currently in 12th Class" },
  { value: "diploma", label: "Diploma Course" },
  { value: "graduation-pursuing", label: "Currently in Graduation" },
  { value: "graduation-completed", label: "Graduation Completed" },
  { value: "postgraduation-pursuing", label: "Currently in Post Graduation" },
  { value: "postgraduation-completed", label: "Post Graduation Completed" },
  { value: "working-professional", label: "Working Professional" },
  { value: "career-gap", label: "Career Gap" },
  { value: "other", label: "Other" },
];

const streamOptions = {
  "10th-completed": [
    { value: "", label: "Select stream preference" },
    { value: "science", label: "Science (PCM/PCB)" },
    { value: "commerce", label: "Commerce" },
    { value: "arts", label: "Arts/Humanities" },
    { value: "vocational", label: "Vocational Course" },
  ],
  "12th-completed": [
    { value: "", label: "Select your stream" },
    { value: "science-pcm", label: "Science (Physics, Chemistry, Maths)" },
    { value: "science-pcb", label: "Science (Physics, Chemistry, Biology)" },
    { value: "commerce", label: "Commerce" },
    { value: "arts", label: "Arts/Humanities" },
    { value: "vocational", label: "Vocational" },
  ],
  "12th-appearing": [
    { value: "", label: "Select your stream" },
    { value: "science-pcm", label: "Science (Physics, Chemistry, Maths)" },
    { value: "science-pcb", label: "Science (Physics, Chemistry, Biology)" },
    { value: "commerce", label: "Commerce" },
    { value: "arts", label: "Arts/Humanities" },
    { value: "vocational", label: "Vocational" },
  ],
  "graduation-pursuing": [
    { value: "", label: "Select your field" },
    { value: "engineering", label: "Engineering" },
    { value: "medical", label: "Medical/MBBS" },
    { value: "bsc", label: "B.Sc (Science)" },
    { value: "bca", label: "BCA (Computer Applications)" },
    { value: "bcom", label: "B.Com (Commerce)" },
    { value: "ba", label: "B.A (Arts)" },
    { value: "bba", label: "BBA (Business Administration)" },
    { value: "law", label: "Law (LLB)" },
    { value: "other", label: "Other" },
  ],
  "graduation-completed": [
    { value: "", label: "Select your field" },
    { value: "engineering", label: "Engineering" },
    { value: "medical", label: "Medical/MBBS" },
    { value: "bsc", label: "B.Sc (Science)" },
    { value: "bca", label: "BCA (Computer Applications)" },
    { value: "bcom", label: "B.Com (Commerce)" },
    { value: "ba", label: "B.A (Arts)" },
    { value: "bba", label: "BBA (Business Administration)" },
    { value: "law", label: "Law (LLB)" },
    { value: "other", label: "Other" },
  ],
};

const interestOptions = [
  "Technology & Programming",
  "Medicine & Healthcare",
  "Engineering & Innovation",
  "Business & Entrepreneurship",
  "Arts & Creative Design",
  "Teaching & Education",
  "Science & Research",
  "Finance & Banking",
  "Law & Legal Studies",
  "Media & Communication",
  "Sports & Fitness",
  "Travel & Tourism",
  "Agriculture & Environment",
  "Social Work & NGO",
  "Government & Civil Services",
  "Music & Entertainment",
  "Fashion & Beauty",
  "Food & Hospitality",
  "Real Estate & Construction",
  "Marketing & Advertising",
];

export default function ProfileSetupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    course: "",
    stream: "",
    interests: [] as string[],
    location: "",
    phone: "",
  });

  const router = useRouter();
  const { user, setProfileCompleted } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Pre-fill name from user data
    if (user.displayName) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
      }));
    }
  }, [user, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset stream when course changes
      ...(name === "course" ? { stream: "" } : {}),
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    // Validation
    if (!formData.name || !formData.age || !formData.course) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (parseInt(formData.age) < 10 || parseInt(formData.age) > 100) {
      setError("Please enter a valid age between 10 and 100");
      setLoading(false);
      return;
    }

    try {
      const profileData = {
        uid: user.uid,
        email: user.email,
        displayName: formData.name,
        age: parseInt(formData.age),
        course: formData.course,
        stream: formData.stream,
        interests: formData.interests,
        location: formData.location,
        phone: formData.phone,
        photoURL: user.photoURL,
        createdAt: new Date(),
      };

      const { error } = await updateProfileCompletion(user.uid, profileData);

      if (error) {
        setError(error);
        setLoading(false);
      } else {
        setProfileCompleted(true);
        router.push("/dashboard");
      }
    } catch {
      setError("Failed to save profile. Please try again.");
      setLoading(false);
    }
  };

  const getStreamOptions = () => {
    return streamOptions[formData.course as keyof typeof streamOptions] || [];
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="h-12 w-12 rounded-lg bg-orange flex items-center justify-center text-white shadow-lg">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Skill-Bridge
              </h1>
              <p className="text-sm text-muted-foreground">AI Career Advisor</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Complete Your Profile
          </h2>
          <p className="text-muted-foreground">
            Help us provide personalized career guidance by telling us about
            yourself
          </p>
        </div>

        {/* Profile Setup Form */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              This information helps our AI provide better career
              recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="age"
                    className="text-sm font-medium text-foreground"
                  >
                    Age *
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="10"
                    max="100"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Enter your age"
                    required
                  />
                </div>
              </div>

              {/* Educational Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Educational Background
                  </h3>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="course"
                    className="text-sm font-medium text-foreground"
                  >
                    Current Status *
                  </label>
                  <div className="relative">
                    <select
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                      required
                    >
                      {courseOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {formData.course && getStreamOptions().length > 0 && (
                  <div className="space-y-2">
                    <label
                      htmlFor="stream"
                      className="text-sm font-medium text-foreground"
                    >
                      Stream/Field
                    </label>
                    <div className="relative">
                      <select
                        id="stream"
                        name="stream"
                        value={formData.stream}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
                      >
                        {getStreamOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="text-sm font-medium text-foreground"
                  >
                    Location (City, State)
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="e.g., Delhi, India"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-foreground"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Interests Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Areas of Interest
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    (Optional)
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select areas you&apos;re interested in to help our AI provide
                  better recommendations
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`p-3 text-left rounded-lg border transition-all ${
                        formData.interests.includes(interest)
                          ? "border-primary bg-orange/10 text-primary"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }`}
                    >
                      <span className="text-sm font-medium">{interest}</span>
                    </button>
                  ))}
                </div>

                {formData.interests.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Selected interests ({formData.interests.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-orange/10 text-primary text-sm rounded-full border border-primary/20"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-orange hover:bg-orange/90 text-white"
                  size="lg"
                  disabled={loading}
                >
                  {loading
                    ? "Setting up your profile..."
                    : "Complete Profile & Continue"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
