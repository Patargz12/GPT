"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ChevronRight,
  Target,
  Users,
  MessageCircle,
  BookOpen,
  Star,
} from "lucide-react";
import Image from "next/image";

// Components
import Navbar from "@/app/components/shared/navbar";
import Footer from "@/app/components/shared/footer";
import dynamic from "next/dynamic";

// MacbookScrollDemo integration from sample_scroll_ui
import { MacbookScroll } from "@/app/components/home/macbook/ui/macbook-scroll";

const Badge = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
      fill="#00AA45"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
      fill="#219653"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.0769 12H15V46H24.3846V38.8889H27.0769C34.7305 38.8889 41 32.9048 41 25.4444C41 17.984 34.7305 12 27.0769 12ZM24.3846 29.7778V21.1111H27.0769C29.6194 21.1111 31.6154 23.0864 31.6154 25.4444C31.6154 27.8024 29.6194 29.7778 27.0769 29.7778H24.3846Z"
      fill="#24292E"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 11H29.0769C36.2141 11 42 16.5716 42 23.4444C42 30.3173 36.2141 35.8889 29.0769 35.8889H25.3846V43H18V11ZM25.3846 28.7778H29.0769C32.1357 28.7778 34.6154 26.39 34.6154 23.4444C34.6154 20.4989 32.1357 18.1111 29.0769 18.1111H25.3846V28.7778Z"
      fill="white"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 10H29.0769C36.7305 10 43 15.984 43 23.4444C43 30.9048 36.7305 36.8889 29.0769 36.8889H26.3846V44H17V10ZM19 12V42H24.3846V34.8889H29.0769C35.6978 34.8889 41 29.7298 41 23.4444C41 17.1591 35.6978 12 29.0769 12H19ZM24.3846 17.1111H29.0769C32.6521 17.1111 35.6154 19.9114 35.6154 23.4444C35.6154 26.9775 32.6521 29.7778 29.0769 29.7778H24.3846V17.1111ZM26.3846 19.1111V27.7778H29.0769C31.6194 27.7778 33.6154 25.8024 33.6154 23.4444C33.6154 21.0864 31.6194 19.1111 29.0769 19.1111H26.3846Z"
      fill="#24292E"
    ></path>
  </svg>
);

// Magic UI Components
import { TextAnimate } from "@/components/ui/text-animate";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";
import { Meteors } from "@/components/ui/meteors";
import { Particles } from "@/components/ui/particles";

export default function Home() {
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor("#ff0000");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Navigation */}
      <Navbar />

      {/* New Hero Section: MacbookScrollDemo (from sample_scroll_ui) */}
      <div className="w-full overflow-hidden bg-[#161e2b] relative z-20">
        <Meteors 
          number={35}
          minDelay={0.1}
          maxDelay={0.6}
          minDuration={1.5}
          maxDuration={5}
          className="opacity-70"
        />
        <MacbookScroll
          badge={
            <a href="https://peerlist.io/manuarora">
              <Badge className="h-10 w-10 -rotate-12 transform" />
            </a>
          }
          src={"/linear.webp"}
          showGradient={false}
        />
      </div>

      {/* Background Effects */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={50}
        ease={80}
        color={color}
        refresh
      />

      {/* Old Hero Section moved below MacbookScrollDemo */}
      <header className="relative z-10 pt-32 pb-32">
        <div className="container mx-auto px-6 text-center">
          {/* Animated Badge */}
          <div className="mb-8 flex justify-center">
            <div className="group rounded-full border border-white/10 bg-white/5 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-white/10">
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span>✨ Master Dota 2 Gameplay</span>
                <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </div>

          {/* Main Title (Logo Image) */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/dotagpt_logo.png"
              alt="DotaGPT Logo"
              width={700}
              height={360}
              className="w-auto object-contain drop-shadow-lg"
              style={{ filter: "drop-shadow(0 4px 24px rgba(255,0,0,0.3))" }}
            />
          </div>

          {/* Subtitle */}
          <TextAnimate
            animation="slideUp"
            by="word"
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            delay={0.5}
            once
          >
            AI-powered assistant designed for Dota 2 players. Learn the 5
            positions, get gameplay advice, and master strategic insights.
          </TextAnimate>

          {/* CTA Button */}
          <div className="mb-16 flex justify-center">
            <Link href="/chat">
              <ShimmerButton className="text-lg px-8 py-4">
                <span className="whitespace-pre-wrap text-center font-medium leading-none tracking-tight text-white lg:text-lg">
                  Start Chat
                </span>
              </ShimmerButton>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <NumberTicker
                value={500}
                className="text-4xl font-bold text-red-500"
              />
              <p className="text-gray-400 mt-2">Current Users</p>
            </div>
            <div className="text-center">
              <NumberTicker
                value={1000}
                className="text-4xl font-bold text-red-500"
              />
              <p className="text-gray-400 mt-2">Tips & Strategies</p>
            </div>
            <div className="text-center">
              <NumberTicker
                value={3}
                className="text-4xl font-bold text-red-500"
              />
              <p className="text-gray-400 mt-2">AI Support</p>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <TextAnimate
              animation="blurIn"
              className="text-4xl md:text-5xl font-bold mb-4"
              once
            >
              Master Every Position
            </TextAnimate>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From Carry to Support, learn the fundamentals of each Dota 2
              position with our comprehensive guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Position Guides",
                description:
                  "Detailed guides for all 5 positions with beginner-friendly explanations",
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "AI Chat Assistant",
                description:
                  "Get instant answers to your Dota 2 questions from our intelligent bot",
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Learning Resources",
                description:
                  "Curated tips, strategies, and best practices for new players",
              },
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <div className="relative p-8 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 overflow-hidden">
                  <BorderBeam size={100} duration={12} delay={index * 2} />
                  <Meteors number={5} />

                  <div className="relative z-10">
                    <div className="text-red-500 mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <TextAnimate
              animation="slideUp"
              className="text-4xl md:text-5xl font-bold mb-4"
              once
            >
              What Players Say
            </TextAnimate>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of players who&apos;ve improved their Dota 2 skills
              with DotaGPT.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Chen",
                role: "Herald → Crusader",
                content:
                  "DotaGPT helped me understand support positioning. Climbed 2 ranks in a month!",
                rating: 5,
              },
              {
                name: "Sarah Kim",
                role: "New Player",
                content:
                  "The position guides are perfect for beginners. Finally understand what each role does.",
                rating: 5,
              },
              {
                name: "Mike Rodriguez",
                role: "Guardian → Archon",
                content:
                  "The AI chat feature answers all my questions instantly. Game-changer for learning.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="relative group">
                <div className="relative p-6 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-red-500/30 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-red-900/20 to-red-800/20">
        <div className="container mx-auto px-6 text-center">
          <TextAnimate
            animation="blurInUp"
            className="text-4xl md:text-6xl font-bold mb-6"
            once
          >
            Ready to Improve?
          </TextAnimate>

          <TextAnimate
            animation="slideUp"
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            delay={0.3}
            once
          >
            Start your journey from beginner to pro. Learn the positions, master
            the strategies, and climb the ranks.
          </TextAnimate>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/chat">
              <ShimmerButton className="text-lg px-8 py-4">
                <span className="whitespace-pre-wrap text-center font-medium leading-none tracking-tight text-white lg:text-lg">
                  Start Chatting
                </span>
              </ShimmerButton>
            </Link>

            <Link
              href="/positions"
              className="inline-flex items-center px-6 py-3 border border-gray-600 rounded-lg hover:border-red-500 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              View Position Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
