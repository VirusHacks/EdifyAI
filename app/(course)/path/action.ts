'use server'

// import { db } from '@/db/db'
// import { pathways, userProgress } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
// import { generatePathway } from '@/lib/gemini'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/configs/db'
import { pathways, userProgress } from '@/db/schema/chapter'
import { generatePathway } from '@/configs/ai-models'

export async function createPathway(career: string, description: string) {
  const prompt = `Generate a detailed learning pathway for a ${career} based on the following description: ${description}`
  
  try {
    const result = await generatePathway.sendMessage(prompt)
    const pathwayData = JSON.parse(result.response.text())
    
    const [inserted] = await db.insert(pathways).values({
      slug: uuidv4(),
      title: pathwayData.title,
      description: pathwayData.description,
      estimatedTime: pathwayData.estimatedTime,
      difficulty: pathwayData.difficulty,
      prerequisites: pathwayData.prerequisites,
      steps: pathwayData.steps,
    }).returning()

    return inserted
  } catch (error) {
    console.error('Error generating pathway:', error)
    throw new Error('Failed to generate pathway')
  }
}

export async function getPathway(slug: string) {
  const [pathway] = await db.select().from(pathways).where(eq(pathways.slug, slug))
  return pathway
}

export async function getAllPathways() {
  const allpathways = await db.select().from(pathways)
  return allpathways
} 

export async function updateUserProgress(userId: string, pathwayId: number, completedSteps: number) {
  await db.insert(userProgress).values({
    userId,
    pathwayId,
    completedSteps,
  }).onConflictDoUpdate({
    target: [userProgress.userId, userProgress.pathwayId],
    set: { completedSteps, updatedAt: new Date() },
  })
}

export async function getUserProgress(userId: string, pathwayId: number) {
  const [progress] = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.pathwayId, pathwayId)))
  return progress?.completedSteps || 0
}

