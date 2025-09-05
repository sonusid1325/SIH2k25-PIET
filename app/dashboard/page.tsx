"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  BookOpen,
  TrendingUp,
  Award,
  Brain,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import Navbar from "@/components/navbar";

export default function DashboardPage() {
  const { user, profileCompleted, loading } = useAuth();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-lg bg-orange flex items-center justify-center text-white shadow-lg mx-auto mb-4 animate-pulse">
            <GraduationCap className="h-7 w-7" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profileCompleted) {
    return null;
  }

  const quickActions = [
    {
      title: "Career Assessment",
      description: "Take our AI-powered career assessment",
      icon: Brain,
      href: "/career-assessment",
      color: "bg-blue-500",
    },
    {
      title: "Course Explorer",
      description: "Explore courses and colleges",
      icon: BookOpen,
      href: "/courses",
      color: "bg-green-500",
    },
    {
      title: "Career Path",
      description: "View your personalized career roadmap",
      icon: TrendingUp,
      href: "/career-path",
      color: "bg-purple-500",
    },
    {
      title: "Resources",
      description: "Access study materials and guides",
      icon: Award,
      href: "/resources",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Your Career Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Let&apos;s continue your journey towards the perfect career path
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 cursor-pointer"
            >
              <Link href={action.href}>
                <CardHeader className="pb-3">
                  <div
                    className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center text-white mb-2`}
                  >
                    <action.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Your Progress
                </CardTitle>
                <CardDescription>
                  Track your career exploration journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">
                      Profile Completion
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Your profile is set up
                    </p>
                  </div>
                  <div className="text-green-600 font-semibold">✓ Complete</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">
                      Career Assessment
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Discover your ideal career path
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/career-assessment">Start Now</Link>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg opacity-60">
                  <div>
                    <h4 className="font-medium text-foreground">
                      Course Recommendations
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Unlock after assessment
                    </p>
                  </div>
                  <div className="text-muted-foreground">Locked</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Profile Score
                  </span>
                  <span className="font-semibold text-green-600">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Assessments
                  </span>
                  <span className="font-semibold">0/3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Recommendations
                  </span>
                  <span className="font-semibold">Pending</span>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">
                        Take Career Assessment
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Complete our AI-powered assessment to get personalized
                        recommendations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Explore Courses
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Browse recommended courses and colleges
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Create Action Plan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Build your personalized career roadmap
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
