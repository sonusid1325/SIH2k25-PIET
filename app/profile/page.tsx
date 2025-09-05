"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Heart,
  Edit,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Navbar from "@/components/navbar";

interface UserProfile {
  displayName: string;
  email: string;
  age: number;
  course: string;
  stream: string;
  interests: string[];
  location: string;
  phone: string;
  photoURL: string | null;
  createdAt: { toDate?: () => Date } | null;
}

export default function ProfilePage() {
  const { user, profileCompleted, loading } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!profileCompleted) {
        router.push("/profile-setup");
      }
    }
  }, [user, profileCompleted, loading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && profileCompleted) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setProfileData(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setProfileLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user, profileCompleted]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="h-12 w-12 rounded-lg bg-orange flex items-center justify-center text-white shadow-lg mx-auto mb-4 animate-pulse">
              <User className="h-7 w-7" />
            </div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profileCompleted || !profileData) {
    return null;
  }

  const getCourseDisplayName = (course: string) => {
    const courseMap: Record<string, string> = {
      "10th-completed": "10th Class Completed",
      "10th-appearing": "Currently in 10th Class",
      "12th-completed": "12th Class Completed",
      "12th-appearing": "Currently in 12th Class",
      diploma: "Diploma Course",
      "graduation-pursuing": "Currently in Graduation",
      "graduation-completed": "Graduation Completed",
      "postgraduation-pursuing": "Currently in Post Graduation",
      "postgraduation-completed": "Post Graduation Completed",
      "working-professional": "Working Professional",
      "career-gap": "Career Gap",
      other: "Other",
    };
    return courseMap[course] || course;
  };

  const getStreamDisplayName = (stream: string) => {
    const streamMap: Record<string, string> = {
      "science-pcm": "Science (Physics, Chemistry, Maths)",
      "science-pcb": "Science (Physics, Chemistry, Biology)",
      commerce: "Commerce",
      arts: "Arts/Humanities",
      vocational: "Vocational",
      engineering: "Engineering",
      medical: "Medical/MBBS",
      bsc: "B.Sc (Science)",
      bca: "BCA (Computer Applications)",
      bcom: "B.Com (Commerce)",
      ba: "B.A (Arts)",
      bba: "BBA (Business Administration)",
      law: "Law (LLB)",
      other: "Other",
    };
    return streamMap[stream] || stream;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  My Profile
                </h1>
                <p className="text-muted-foreground">
                  Manage your personal information and preferences
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="border-border/50">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {profileData.photoURL ? (
                      <Image
                        src={profileData.photoURL}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-orange flex items-center justify-center text-white text-2xl font-bold">
                        {profileData.displayName?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl">
                    {profileData.displayName}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1">
                    <Mail className="h-3 w-3" />
                    {profileData.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Age: {profileData.age} years</span>
                  </div>
                  {profileData.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                  {profileData.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Educational Background */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Educational Background
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Current Status
                    </label>
                    <p className="text-foreground font-medium">
                      {getCourseDisplayName(profileData.course)}
                    </p>
                  </div>
                  {profileData.stream && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Stream/Field
                      </label>
                      <p className="text-foreground font-medium">
                        {getStreamDisplayName(profileData.stream)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interests */}
              {profileData.interests && profileData.interests.length > 0 && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      Areas of Interest
                    </CardTitle>
                    <CardDescription>
                      Your selected interests help us provide better
                      recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profileData.interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant="outline"
                          className="border-primary/20 text-primary bg-orange/10"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Account Info */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Member Since
                      </label>
                      <p className="text-foreground font-medium">
                        {profileData.createdAt?.toDate
                          ? profileData.createdAt.toDate().toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Profile Status
                      </label>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          ✓ Complete
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
