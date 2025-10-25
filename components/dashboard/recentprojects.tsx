"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Edit3,
  Copy,
  MoreHorizontal,
  Clock,
  FileText,
  Image as ImageIcon,
  Award,
} from "lucide-react";

// ✅ Mock Background Components (self-contained)
function CardBackground({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg p-4 bg-white/80 dark:bg-gray-900/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

function GlassBackground({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

// ✅ Project Type
interface Project {
  id: string;
  title: string;
  type: "poster" | "card" | "certificate" | "logo";
  thumbnail: string;
  lastModified: string;
  status: "draft" | "completed" | "in-progress";
  size: string;
}

// ✅ Helpers
const getTypeIcon = (type: Project["type"]) => {
  switch (type) {
    case "poster":
      return <ImageIcon size={14} />;
    case "card":
      return <FileText size={14} />;
    case "certificate":
      return <Award size={14} />;
    case "logo":
      return <Edit3 size={14} />;
    default:
      return <FileText size={14} />;
  }
};

const getTypeColor = (type: Project["type"]) => {
  switch (type) {
    case "poster":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
    case "card":
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
    case "certificate":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400";
    case "logo":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
    case "in-progress":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";
    case "draft":
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default function RecentProjects() {
  // ✅ Mock Data
  const recentProjects: Project[] = [
    {
      id: "1",
      title: "Corporate Event Poster",
      type: "poster",
      thumbnail: "https://placehold.co/300x400/3B82F6/FFFFFF?text=Poster",
      lastModified: "2 hours ago",
      status: "in-progress",
      size: "1920x1080",
    },
    {
      id: "2",
      title: "Business Card Design",
      type: "card",
      thumbnail: "https://placehold.co/300x200/10B981/FFFFFF?text=Card",
      lastModified: "1 day ago",
      status: "completed",
      size: "3.5x2 in",
    },
    {
      id: "3",
      title: "Achievement Certificate",
      type: "certificate",
      thumbnail: "https://placehold.co/400x300/8B5CF6/FFFFFF?text=Certificate",
      lastModified: "3 days ago",
      status: "completed",
      size: "A4",
    },
    {
      id: "4",
      title: "Brand Logo Concept",
      type: "logo",
      thumbnail: "https://placehold.co/300x300/F59E0B/FFFFFF?text=Logo",
      lastModified: "1 week ago",
      status: "draft",
      size: "512x512",
    },
  ];

  return (
    <section className="w-full mb-12 px-4 sm:px-6 lg:px-8">
      <CardBackground className="p-6 sm:p-8">
        {/* ✅ Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Recent Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Continue working on your latest designs
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* ✅ Responsive Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
            >
              <GlassBackground className="p-4 transition-all duration-300 group-hover:shadow-xl">
                {/* Thumbnail */}
                <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-40 sm:h-32 md:h-40 lg:h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200">
                        <Edit3 size={14} />
                      </button>
                      <button className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200">
                        <Copy size={14} />
                      </button>
                      <button className="p-2 bg-white/90 dark:bg-gray-900/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status.replace("-", " ")}
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300 line-clamp-1 text-sm sm:text-base">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ${getTypeColor(
                          project.type
                        )}`}
                      >
                        {getTypeIcon(project.type)}
                        {project.type}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {project.size}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock size={12} />
                    <span>{project.lastModified}</span>
                  </div>
                </div>
              </GlassBackground>
            </motion.div>
          ))}
        </div>

        {/* ✅ Empty State */}
        {recentProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recent projects
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start creating your first design project
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Create New Project
            </button>
          </motion.div>
        )}
      </CardBackground>
    </section>
  );
}
