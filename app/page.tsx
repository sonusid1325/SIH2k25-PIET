"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar";
import {
  GraduationCap,
  BookOpen,
  Users,
  TrendingUp,
  Target,
  Brain,
  ArrowRight,
  Star,
  MapPin,
  Zap,
  Shield,
  Heart,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Guidance",
      description:
        "Get personalized career recommendations based on your interests, skills, and academic performance.",
    },
    {
      icon: Target,
      title: "Subject Combinations",
      description:
        "Find the perfect subject combination after Class 12th that aligns with your career goals.",
    },
    {
      icon: GraduationCap,
      title: "College Selection",
      description:
        "Discover suitable degree courses in local government colleges with detailed information.",
    },
    {
      icon: TrendingUp,
      title: "Career Outcomes",
      description:
        "Understand long-term prospects including job opportunities, entrance exams, and skill development.",
    },
    {
      icon: BookOpen,
      title: "Free Resources",
      description:
        "Access open-source e-books, study materials, and scholarship opportunities.",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Connect with peers and mentors for guidance and support throughout your journey.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Students Guided" },
    { number: "500+", label: "Government Colleges" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Delhi",
      text: "CareerPath helped me choose the right engineering stream. Now I'm in my dream college!",
      rating: 5,
    },
    {
      name: "Rahul Kumar",
      location: "Bihar",
      text: "The scholarship information was a game-changer. I got full funding for my studies.",
      rating: 5,
    },
    {
      name: "Anjali Patel",
      location: "Gujarat",
      text: "The career outcome predictions were spot-on. I'm exactly where they said I'd be!",
      rating: 5,
    },
  ];

  const impacts = [
    {
      icon: TrendingUp,
      title: "Improved Enrollment",
      description:
        "Helping students make informed decisions increases government college enrollment",
    },
    {
      icon: Shield,
      title: "Reduced Dropouts",
      description:
        "Better guidance reduces dropout rates after Class 10 and 12",
    },
    {
      icon: Heart,
      title: "Empowered Students",
      description:
        "Providing access to reliable, localized career guidance for all",
    },
    {
      icon: Globe,
      title: "Stronger Institutions",
      description:
        "Building trust in government colleges as viable career-building institutions",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-orange-light opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="outline"
              className={`mb-6 text-primary border-primary/50 animate-fade-in-up ${isVisible ? "" : "opacity-0"}`}
            >
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Career Guidance
            </Badge>

            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in-up ${isVisible ? "" : "opacity-0"} animate-delay-100`}
            >
              Your{" "}
              <span className="bg-gradient-orange bg-clip-text text-transparent">
                AI Career
              </span>{" "}
              Advisor
            </h1>

            <p
              className={`text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up ${isVisible ? "" : "opacity-0"} animate-delay-200`}
            >
              Navigate your educational journey with confidence. Get
              personalized guidance for subject selection, college choices, and
              career paths tailored specifically for Indian students.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up ${isVisible ? "" : "opacity-0"} animate-delay-300`}
            >
              <Button
                size="lg"
                className="bg-gradient-orange hover:opacity-90 text-white shadow-lg px-8"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center animate-scale-in animate-delay-${index * 100}`}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 text-primary border-primary/50"
            >
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Your Career Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and guidance you
              need to make informed educational decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={`hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 animate-fade-in-up animate-delay-${index * 100}`}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 text-primary border-primary/50"
            >
              Our Impact
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Transforming Educational Outcomes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how our platform is making a real difference in students&apos;
              lives and strengthening the education ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((impact, index) => (
              <Card
                key={impact.title}
                className={`text-center hover:shadow-lg transition-all duration-300 animate-scale-in animate-delay-${index * 100}`}
              >
                <CardHeader>
                  <div className="h-16 w-16 rounded-full bg-gradient-orange flex items-center justify-center mx-auto mb-4 text-white">
                    <impact.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg">{impact.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{impact.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 text-primary border-primary/50"
            >
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple Steps to Your Career Success
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Tell Us About Yourself",
                  description:
                    "Share your interests, academic performance, and career aspirations with our AI.",
                },
                {
                  step: "02",
                  title: "Get Personalized Recommendations",
                  description:
                    "Receive tailored suggestions for subjects, colleges, and career paths based on your profile.",
                },
                {
                  step: "03",
                  title: "Access Resources & Support",
                  description:
                    "Get study materials, scholarship info, and ongoing guidance throughout your journey.",
                },
              ].map((step, index) => (
                <div
                  key={step.step}
                  className={`text-center animate-fade-in-up animate-delay-${index * 200}`}
                >
                  <div className="h-16 w-16 rounded-full bg-gradient-orange text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 text-primary border-primary/50"
            >
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Students Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className={`animate-scale-in animate-delay-${index * 100}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-orange flex items-center justify-center text-white text-sm font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-orange opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Shape Your Future?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students who have found their perfect career
              path with our AI-powered guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-orange hover:opacity-90 text-white shadow-lg px-8"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-orange flex items-center justify-center text-white">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">CareerPath</h3>
                  <p className="text-xs text-muted-foreground">
                    AI Career Advisor
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering students with AI-driven career guidance and
                educational support.
              </p>
            </div>

            {[
              {
                title: "Platform",
                links: [
                  "Career Guide",
                  "College Finder",
                  "Resources",
                  "Scholarships",
                ],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact Us", "Community", "Blog"],
              },
              {
                title: "Company",
                links: [
                  "About Us",
                  "Privacy Policy",
                  "Terms of Service",
                  "Careers",
                ],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 CareerPath. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Privacy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Terms
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
