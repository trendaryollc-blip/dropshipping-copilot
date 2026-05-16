"use client"

import { toast } from "sonner"
import aiService from "@/lib/ai-service"

export function testAIFeatures() {
  return {
    testProductAnalysis: () => {
      toast.info("🧠 Testing AI Product Analysis...")
      aiService.analyzeProduct("Wireless Earbuds", "Electronics")
        .then(result => {
          console.log("✅ Product analysis result:", result)
          toast.success("✅ AI Product Analysis working!")
        })
        .catch(error => {
          console.error("❌ Analysis failed:", error)
          toast.error("❌ AI Analysis failed")
        })
    },

    testDescriptionGeneration: () => {
      toast.info("✍️ Testing AI Description Generation...")
      aiService.generateDescription({
        productName: "Smart Watch Pro",
        category: "Electronics",
        features: ["Heart rate monitoring", "GPS tracking", "Water resistant", "7-day battery"],
        targetAudience: "Fitness enthusiasts",
        tone: "professional",
        keywords: ["smartwatch", "fitness", "health tracking"]
      })
        .then(description => {
          console.log("✅ Generated description:", description)
          toast.success("✅ AI Description Generator working!")
        })
        .catch(error => {
          console.error("❌ Generation failed:", error)
          toast.error("❌ AI Description failed")
        })
    },

    testPriceOptimization: () => {
      toast.info("💰 Testing AI Price Optimization...")
      aiService.optimizePrice(299.99, "Electronics")
        .then(result => {
          console.log("✅ Price optimization result:", result)
          toast.success("✅ AI Price Optimization working!")
        })
        .catch(error => {
          console.error("❌ Optimization failed:", error)
          toast.error("❌ AI Price Optimization failed")
        })
    },

    testCompetitionAnalysis: () => {
      toast.info("📊 Testing AI Competition Analysis...")
      aiService.analyzeCompetition("Wireless Earbuds", "Electronics")
        .then(result => {
          console.log("✅ Competition analysis result:", result)
          toast.success("✅ AI Competition Analysis working!")
        })
        .catch(error => {
          console.error("❌ Analysis failed:", error)
          toast.error("❌ AI Competition Analysis failed")
        })
    },
  }
}
