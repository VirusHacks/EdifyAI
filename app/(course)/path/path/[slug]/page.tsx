
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Clock, BookOpen, GraduationCap } from 'lucide-react'
import Link from "next/link"
import { getPathway } from "../../action"

export default async function PathPage({ params }: { params: { slug: string } }) {
  const pathway = await getPathway(params.slug)
  // In a real app, you'd get the user ID from the session from clerk
  const userId = '123'
  const completedSteps = 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Button variant="ghost" asChild className="-ml-4">
            <Link href="/course-dashboard/path" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to paths
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                {pathway.title}
              </CardTitle>
              <CardDescription className="text-lg">
                {pathway.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{pathway.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <span>{pathway.difficulty}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <ul className="list-disc list-inside">
                  {pathway.prerequisites.map((prereq, index) => (
                    <li key={index}>{prereq}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Your Progress</h3>
                <Progress value={(completedSteps / pathway.steps.length) * 100} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {completedSteps} of {pathway.steps.length} steps completed
                </p>
              </div>

              <div className="space-y-6">
                {pathway.steps.map((step, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </span>
                        {step.title}
                      </CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{step.estimatedTime}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Resources</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {step.resources.map((resource, resourceIndex) => (
                            <li key={resourceIndex}>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {resource.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <StepCompletion 
                        stepIndex={index} 
                        isCompleted={index < completedSteps}
                        userId={userId}
                        pathwayId={pathway.id}
                        totalSteps={pathway.steps.length}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

function StepCompletion({ 
  stepIndex, 
  isCompleted, 
  userId, 
  pathwayId, 
  totalSteps 
}: { 
  stepIndex: number
  isCompleted: boolean
  userId: string
  pathwayId: number
  totalSteps: number
}) {
  const toggleCompletion = async () => {
    'use server'
    const newCompletedSteps = isCompleted ? stepIndex : stepIndex + 1
    // await updateUserProgress(userId, pathwayId, newCompletedSteps)
  }

  return (
    <form action={toggleCompletion}>
      <Button type="submit" variant={isCompleted ? "outline" : "default"} className="w-full">
        {isCompleted ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Completed
          </>
        ) : (
          <>
            <BookOpen className="mr-2 h-4 w-4" />
            Mark as Complete
          </>
        )}
      </Button>
    </form>
  )
}

