"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Student",
    monthlyPrice: "Free",
    yearlyPrice: "Free",
    description: "Perfect for individual learners",
    features: [
      "Access to all basic courses",
      "Progress tracking",
      "Mobile learning support",
      "Course completion certificates",
      "Community forum access",
    ],
  },
  {
    name: "Professional",
    monthlyPrice: 799,
    yearlyPrice: 7999,
    description: "Ideal for career advancement",
    features: [
      "Everything in Student plan",
      "Advanced specialization courses",
      "Live mentorship sessions",
      "Career guidance support",
      "Industry project reviews",
      "Priority support response",
      "LinkedIn certification",
    ],
  },
  {
    name: "Creator",
    monthlyPrice: 1999,
    yearlyPrice: 19999,
    description: "For course creators and institutions",
    features: [
      "Everything in Professional plan",
      "Course creation tools",
      "Analytics dashboard",
      "Custom branding options",
      "Revenue sharing (80/20)",
      "Marketing tools & support",
      "Dedicated success manager",
      "API access",
    ],
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
          Choose Your Learning Journey
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Flexible plans to support your educational goals
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center items-center mb-8"
      >
        <span className="mr-3 text-sm font-medium">Monthly</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-blue-600" />
        <span className="ml-3 text-sm font-medium">Yearly (Save 20%)</span>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
          >
            <Card className={`flex flex-col h-full ${index === 1 ? "border-blue-200 shadow-lg" : ""}`}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    ₹{isYearly ? plan.yearlyPrice.toLocaleString("en-IN") : plan.monthlyPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">{isYearly ? "/year" : "/month"}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * (featureIndex + 1) }}
                      className="flex items-center"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={index === 1 ? "default" : "outline"} size="lg">
                  {index === 2 ? "Contact Sales" : "Start Learning"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-12 text-center space-y-4"
      >
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">Education Partner Program</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Are you an educational institution? Get special pricing and features with our partner program.
          </p>
          <Button variant="link" className="mt-2">
            Learn more about partnerships →
          </Button>
        </div>

        <p className="text-gray-600 dark:text-gray-300">
          All plans include a 7-day free trial. No credit card required.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Need a custom enterprise solution?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Let's talk
          </a>
        </p>
      </motion.div>
    </div>
  )
}

