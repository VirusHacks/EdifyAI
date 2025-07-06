'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Wand2 } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

import { useRouter } from 'next/navigation'
import { createPathway } from "../action"

export default function CreatePath() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [career, setCareer] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsGenerating(true)
    try {
      const pathway = await createPathway(career, description)
      router.push(`/path/path/${pathway.slug}`)
    } catch (error) {
      console.error('Failed to generate pathway:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Button variant="ghost" asChild className="-ml-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to paths
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Create Custom Learning Path</CardTitle>
              <CardDescription>
                Describe your desired career path and we&apos;ll generate a personalized learning journey for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="career" className="text-sm font-medium">
                    Career Title
                  </label>
                  <Input
                    id="career"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    placeholder="e.g., Machine Learning Engineer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your career goals and any specific areas you'd like to focus on..."
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="mr-2 h-4 w-4 animate-pulse" />
                      Generating your path...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Learning Path
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

