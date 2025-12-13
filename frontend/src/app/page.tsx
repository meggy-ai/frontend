import Link from "next/link";
import { 
  Bot, 
  MessageSquare, 
  Sparkles, 
  Users, 
  Zap, 
  ArrowRight, 
  Code2,
  Shield,
  Globe,
  Rocket,
  CheckCircle2,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 sm:pt-32 sm:pb-40">
          {/* Enhanced Animated background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-white to-emerald-50 dark:from-blue-950/20 dark:via-background dark:to-emerald-950/20"></div>
          
          {/* Floating orbs with better animation */}
          <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 h-96 w-96 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 h-96 w-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob animation-delay-4000"></div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="mx-auto max-w-5xl">
              {/* Badge */}
              <div className="mb-8 flex justify-center">
                <Badge 
                  variant="secondary" 
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  India&apos;s First Open Source AI Platform
                </Badge>
              </div>

              {/* Main Headline */}
              <h1 className="mb-8 text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
                Build Your Perfect{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent animate-gradient">
                    AI Assistant
                  </span>
                  <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 blur-lg"></span>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mb-12 max-w-3xl text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                Create personalized AI agents for any use case. From personal assistants to AI
                friends, Meggy AI makes it simple to{" "}
                <span className="font-semibold text-foreground">build</span>,{" "}
                <span className="font-semibold text-foreground">deploy</span>, and{" "}
                <span className="font-semibold text-foreground">scale</span> your AI solutions.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  asChild
                >
                  <Link href="/auth/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 text-lg font-semibold border-2 hover:bg-muted/50"
                  asChild
                >
                  <Link href="#features">
                    Explore Features
                  </Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>100% Open Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span>Trusted by developers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-20 text-center">
              <Badge variant="outline" className="mb-4 px-4 py-1">
                <Zap className="mr-2 h-4 w-4" />
                Features
              </Badge>
              <h2 className="mb-6 text-4xl sm:text-5xl font-bold tracking-tight">
                Everything You Need to Build{" "}
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Powerful AI Agents
                </span>
              </h2>
              <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
                A complete platform with all the tools you need to create, deploy, and manage AI agents at scale
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Card 1 */}
              <Card className="group relative overflow-hidden border-2 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-background to-muted/20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300"></div>
                <CardHeader className="relative">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                    <Bot className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl">AI Agent Builder</CardTitle>
                  <CardDescription className="text-base">
                    Create custom AI agents with our intuitive visual builder. No coding required. Configure personality, knowledge, and capabilities with ease.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature Card 2 */}
              <Card className="group relative overflow-hidden border-2 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-background to-muted/20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all duration-300"></div>
                <CardHeader className="relative">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg group-hover:shadow-emerald-500/50 transition-shadow">
                    <MessageSquare className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl">Real-time Chat</CardTitle>
                  <CardDescription className="text-base">
                    Engage with your AI agents through our advanced chat interface with streaming responses, markdown support, and conversation history.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature Card 3 */}
              <Card className="group relative overflow-hidden border-2 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-background to-muted/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 transition-all duration-300"></div>
                <CardHeader className="relative">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                    <Users className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl">Multi-Agent System</CardTitle>
                  <CardDescription className="text-base">
                    Deploy multiple specialized agents that can work together to solve complex tasks. Coordinate and orchestrate agent workflows.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature Card 4 */}
              <Card className="group relative overflow-hidden border-2 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-background to-muted/20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/10 transition-all duration-300"></div>
                <CardHeader className="relative">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg group-hover:shadow-amber-500/50 transition-shadow">
                    <Zap className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl">Lightning Fast</CardTitle>
                  <CardDescription className="text-base">
                    Built with performance in mind. Get instant responses from your AI agents with optimized inference and caching strategies.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature Card 5 */}
              <Card className="group relative overflow-hidden border-2 hover:border-rose-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-background to-muted/20">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-rose-500/0 group-hover:from-rose-500/5 group-hover:to-rose-500/10 transition-all duration-300"></div>
                <CardHeader className="relative">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg group-hover:shadow-rose-500/50 transition-shadow">
                    <Shield className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl">Open Source</CardTitle>
                  <CardDescription className="text-base">
                    Fully open source and transparent. Customize everything to fit your needs. Community-driven development with regular updates.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature Card 6 */}
              <Card className="group relative overflow-hidden border-2 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-background to-muted/20">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                <CardHeader className="relative">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg group-hover:shadow-cyan-500/50 transition-shadow">
                    <Code2 className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-2xl">Easy Integration</CardTitle>
                  <CardDescription className="text-base">
                    Simple REST APIs and webhooks to integrate AI agents into your existing applications. Comprehensive documentation included.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-sm text-muted-foreground font-medium">Open Source</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  &lt;100ms
                </div>
                <div className="text-sm text-muted-foreground font-medium">Response Time</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-sm text-muted-foreground font-medium">Uptime</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-sm text-muted-foreground font-medium">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <Rocket className="mx-auto mb-6 h-16 w-16 text-blue-600" />
            <h2 className="mb-6 text-4xl sm:text-5xl font-bold tracking-tight">
              Ready to Build Your First{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                AI Agent?
              </span>
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
              Join thousands of developers already building the future with Meggy AI. Start for free, no credit card required.
            </p>
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all"
              asChild
            >
              <Link href="/auth/register">
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
