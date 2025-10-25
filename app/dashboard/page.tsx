"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Plus,
  Upload,
  LayoutGrid,
  Palette,
  FileText,
  Settings,
} from "lucide-react";

// Assuming these components are available in the specified paths
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/dashboard/Header";
import Usernameheader from "@/components/dashboard/usernameheader";
import BugReporterCard from "@/components/dashboard/BugReporterCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isBugCardOpen, setIsBugCardOpen] = useState(false);

  // Define the shape of a quick action button
  interface QuickAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    hoverColor: string;
    action: () => void;
  }

  // Placeholder navigation function (replace with your actual useNavigation hook or router logic)
  const navigateTo = (path: string) => {
    console.log(`Navigation placeholder: Directing to ${path}`);
    // In a real app, this would likely be:
    // const router = useRouter();
    // router.push(path);
  };

  const quickActions: QuickAction[] = [
    {
      id: "create-poster",
      label: "Create Poster",
      icon: <Plus size={20} />,
      color: "bg-blue-500/20 border-blue-400/40 text-blue-700",
      hoverColor: "hover:bg-blue-500/30 hover:border-blue-400/60",
      action: () => navigateTo("/poster-editor"),
    },
    {
      id: "generate-card",
      label: "Generate Certificates",
      icon: <FileText size={20} />,
      color: "bg-green-500/20 border-green-400/40 text-green-700",
      hoverColor: "hover:bg-green-500/30 hover:border-green-400/60",
      action: () => navigateTo("/cards"),
    },
    {
      id: "manage-templates",
      label: "Generate ID Cards",
      icon: <LayoutGrid size={20} />,
      color: "bg-purple-500/20 border-purple-400/40 text-purple-700",
      hoverColor: "hover:bg-purple-500/30 hover:border-purple-400/60",
      action: () => navigateTo("/templates"),
    },
    {
      id: "upload-asset",
      label: "Generate Visiting Cards",
      icon: <Upload size={20} />,
      color: "bg-orange-500/20 border-orange-400/40 text-orange-700",
      hoverColor: "hover:bg-orange-500/30 hover:border-orange-400/60",
      action: () => navigateTo("/assets/upload"),
    },
    {
      id: "design-tools",
      label: "Design Tools",
      icon: <Palette size={20} />,
      color: "bg-teal-500/20 border-teal-400/40 text-teal-700",
      hoverColor: "hover:bg-teal-500/30 hover:border-teal-400/60",
      action: () => navigateTo("/design-tools"),
    },
    {
      id: "Themes",
      label: "Themes",
      icon: <Settings size={20} />,
      color: "bg-gray-500/20 border-gray-400/40 text-gray-700",
      hoverColor: "hover:bg-gray-500/30 hover:border-gray-400/60",
      action: () => navigateTo("/theme"),
    },
  ];

  return (
    <main className="flex-1 min-h-screen px-4 sm:px-6 lg:px-12 xl:px-20 transition-all duration-300 bg-transparent text-gray-900">
      
      {/* Report Bug Button - Adjusted for responsive positioning and text */}
      <div className="absolute top-18 right-4 sm:top-10 sm:right-10 z-50 flex flex-col items-center">
        <motion.button
          className="p-3 rounded-full bg-blue-600/90 text-white shadow-lg transition-all duration-300 hover:bg-blue-700/90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsBugCardOpen(true)} // Open the card on click
        >
          <Mail size={24} />
        </motion.button>
        
        {/* Full text for medium screens and up */}
        <span className="mt-2 text-xs text-gray-700 dark:text-black-600 text-center whitespace-nowrap hidden sm:block">
          Report a bug <br /> or give feedback for Improvements
        </span>
        
        {/* Simplified text for small mobile screens */}
        <span className="mt-2 text-[10px] text-gray-700 dark:text-black-600 text-center whitespace-nowrap block sm:hidden">
          Report Bug
        </span>
      </div>

      {/* Main Header (usually a logo/nav) - hidden on small screens */}
      <div className="my-4 cursor-pointer hidden lg:block">
        <Header />
      </div>

      {/* Usernameheader - Ensured visibility on mobile by removing visibility classes */}
      <div className="my-4"> 
        <Usernameheader />
      </div>

      {/* ----------------- QUICK ACTIONS SECTION ----------------- */}
      <section className="mb-12 mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900">
          Quick Actions
        </h2>
        {/* Responsive Grid: 2 columns on mobile, 3 on small/tablet, 6 on large desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 shadow-md
                transition-all duration-300 group cursor-pointer h-28
                ${action.color} ${action.hoverColor}
              `}
            >
              <div className="mb-2 transition-transform duration-300 group-hover:scale-110">
                {action.icon}
              </div>
              <span className="text-sm font-medium text-center leading-tight">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </section>
      {/* ------------------------------------------------------------- */}


      {/* Bug Reporter Card */}
      {user && ( // Only render if a user is logged in
        <BugReporterCard
          isOpen={isBugCardOpen}
          onClose={() => setIsBugCardOpen(false)}
          // Assuming user object has 'id' and 'username' properties
          userId={user.id} 
          username={user.username} 
        />
      )}
    </main>
  );
}
