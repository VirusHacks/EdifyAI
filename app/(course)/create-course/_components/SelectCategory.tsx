"use client"

import { useContext } from "react"
import { categoryList } from "../_shared/CategoryList"
import Image from "next/image"
import { UserInputContext } from "@/app/(course)/_context/UserInputContext"
import { Card, CardContent } from "@/components/ui/card"

const SelectCategory = () => {
  const { userInput, setUserInput } = useContext(UserInputContext)

  const handleCategorySelect = (category: string) => {
    setUserInput((prev) => ({ ...prev, category }))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Select the course category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryList.map((category, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all hover:border-black hover:shadow-md ${
              userInput?.category === category.name ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => handleCategorySelect(category.name)}
          >
            <CardContent className="flex flex-col items-center p-6">
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src={category.icon || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h3 className="text-lg font-medium">{category.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SelectCategory

