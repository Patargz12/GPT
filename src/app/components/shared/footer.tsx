import Link from "next/link";
import {
  Github,
  Twitter,
  MessageSquare,
  ExternalLink,
  Shield,
  Sword,
  Users,
  MessageCircle,
  BookOpen,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black/40 backdrop-blur-sm border-t border-gray-800/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                DotaGPT
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered assistant for Dota 2 players. Master the 5 positions,
              improve your gameplay, and climb the ranks.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Discord"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/positions"
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Position Guides</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>AI Chat</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>News</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Dota 2 Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Dota 2 Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.dota2.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Official Dota 2</span>
                </a>
              </li>
              <li>
                <a
                  href="https://store.steampowered.com/app/570/Dota_2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Steam Store</span>
                </a>
              </li>
              <li>
                <a
                  href="https://dota2.fandom.com/wiki/Dota_2_Wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Dota 2 Wiki</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.dotabuff.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Dotabuff</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Positions Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Positions</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/positions/carry"
                  className="text-gray-400 hover:text-red-500 transition-colors flex items-center space-x-2"
                >
                  <Sword className="w-4 h-4" />
                  <span>Position 1 - Carry</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/positions/mid"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Position 2 - Mid
                </Link>
              </li>
              <li>
                <Link
                  href="/positions/offlane"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Position 3 - Offlane
                </Link>
              </li>
              <li>
                <Link
                  href="/positions/support"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Position 4 - Support
                </Link>
              </li>
              <li>
                <Link
                  href="/positions/hard-support"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Position 5 - Hard Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>
                © 2025 DotaGPT. All rights reserved. |{" "}
                <span className="text-gray-500">
                  Dota 2 is a trademark of Valve Corporation.
                </span>
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
