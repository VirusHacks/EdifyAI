"use client"

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAllPathways } from "./action";

const CAREER_PATHS = [
  {
    id: "cloud-architect",
    title: "Cloud Architect Learning Path",
    icon: "🏗️",
    color: "from-blue-500/20 to-cyan-500/20",
    difficulty: "Advanced",
    estimatedTime: "12-18 months",
  },
  {
    id: "data-scientist",
    title: "Data Scientist Learning Path",
    icon: "📊",
    color: "from-purple-500/20 to-pink-500/20",
    difficulty: "Advanced",
    estimatedTime: "12-18 months",
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer Learning Path",
    icon: "💻",
    color: "from-orange-500/20 to-red-500/20",
    difficulty: "Advanced",
    estimatedTime: "12-18 months",
  },
  {
    id: "ux-designer",
    title: "UX Designer Learning Path",
    icon: "🎨",
    color: "from-green-500/20 to-emerald-500/20",
    difficulty: "Advanced",
    estimatedTime: "12-18 months",
  },
  {
    id: "product-manager",
    title: "Product Manager Learning Path",
    icon: "📱",
    color: "from-yellow-500/20 to-orange-500/20",
    difficulty: "Advanced",
    estimatedTime: "12-18 months",
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer Learning Path",
    icon: "⚙️",
    color: "from-indigo-500/20 to-purple-500/20",
    difficulty: "Advanced",
    estimatedTime: "12-18 months",
  },
];

export default function Home() {
  const [pathways, setPathways] = useState(CAREER_PATHS);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPathways = async () => {
      try {
        const fetchedPathways = await getAllPathways();
        console.log(fetchedPathways);
        const customPathways = fetchedPathways.map((pathway) => ({
          id: pathway.slug,
          title: pathway.title,
          difficulty: pathway.difficulty,
          estimatedTime: pathway.estimatedTime,
          icon: "📚", // default icon
          color: "from-gray-500/20 to-gray-500/20",
        }));
        setPathways([...CAREER_PATHS, ...customPathways]);
      } catch (error) {
        console.error("Error fetching pathways:", error);
      }
    };

    fetchPathways();
  }, []);

  const filteredPaths = pathways.filter((path) =>
    path.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          <div className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-block p-3 bg-primary/10 rounded-full mb-4"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Discover Your Learning Path
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose from curated learning paths or create your own custom journey.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by learning path name"
              className="pl-12 py-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/path/create">
                <Card className="border-dashed hover:border-primary transition-colors h-full flex flex-col items-center justify-center p-8 group">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="h-16 w-16 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.div>
                  <p className="mt-6 text-lg font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    Create Custom Path
                  </p>
                </Card>
              </Link>
            </motion.div>

            {filteredPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link href={`/path/path/${path.id}`}>
                  <Card className="h-full flex flex-col justify-between hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-4">
                        <span className="text-4xl">{path.icon}</span>
                        <span className="group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/50 group-hover:bg-clip-text group-hover:text-transparent transition-all text-xl">
                          {path.title}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="text-base text-muted-foreground flex justify-between">
                      {path.difficulty && <span>{path.difficulty}</span>}
                      {path.estimatedTime && <span>{path.estimatedTime}</span>}
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
