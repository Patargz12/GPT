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

// Components
import Navbar from "@/app/components/shared/navbar";
import Footer from "@/app/components/shared/footer";

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

      {/* Background Effects */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={50}
        ease={80}
        color={color}
        refresh
      />

      {/* Header Section */}
      <header className="relative z-10 pt-32 pb-32">
        <div className="container mx-auto px-6 text-center">
          {/* Animated Badge */}
          <div className="mb-8 flex justify-center">
            <div className="group rounded-full border border-white/10 bg-white/5 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-white/10">
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span>✨ Master Dota 2 Positions</span>
                <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </div>

          {/* Main Title */}
          <div className="mb-8 flex justify-center mt-8">
            <TextAnimate
              animation="blurInUp"
              by="word"
              className="text-6xl md:text-8xl font-bold mb-4"
              once
            >
              DOTA
            </TextAnimate>
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: "easeOut",
              }}
            >
              <AnimatedGradientText className="text-6xl md:text-8xl font-bold">
                GPT
              </AnimatedGradientText>
            </motion.div>
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
                value={5}
                className="text-4xl font-bold text-red-500"
              />
              <p className="text-gray-400 mt-2">Positions to Master</p>
            </div>
            <div className="text-center">
              <NumberTicker
                value={1000}
                className="text-4xl font-bold text-red-500"
              />
              <p className="text-gray-400 mt-2">+ Tips & Strategies</p>
            </div>
            <div className="text-center">
              <NumberTicker
                value={24}
                className="text-4xl font-bold text-red-500"
              />
              <p className="text-gray-400 mt-2">/ 7 AI Support</p>
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
