"use client"

import { useEffect, useRef, useState } from "react"
import { ColorSwatch, Group, Button, Text, Container, Paper } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import axios from "axios"
import Draggable from "react-draggable"

const SWATCHES = [
  "#ffffff",
  "#ee3333",
  "#e64980",
  "#be4bdb",
  "#893200",
  "#228be6",
  "#00FFFF",
  "#3333ee",
  "#40c057",
  "#00aa00",
  "#fab005",
  "#fd7e14",
]

interface Response {
  expr: string
  result: string
  assign: boolean
}

interface GeneratedResult {
  expression: string
  answer: string
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEraser, setIsEraser] = useState(false)
  const [color, setColor] = useState("#ffffff")
  const [results, setResults] = useState<Array<GeneratedResult>>([])
  const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 })
  const [latexExpression, setLatexExpression] = useState<Array<string>>([])
  const [dictOfVars, setDictOfVars] = useState<Record<string, string>>({})

  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub])
      }, 0)
    }
  }, [latexExpression])

  useEffect(() => {
    if (results.length > 0) {
      results.forEach(({ expression, answer }) => {
        const latex = `\$$\\LARGE{${expression} = ${answer}}\$$`
        setLatexExpression((prevLatex) => [...prevLatex, latex])
      })
    }
  }, [results])

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight - canvas.offsetTop
        ctx.lineCap = "round"
        ctx.lineWidth = 3
      }
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML"
      script.async = true
      document.head.appendChild(script)

      script.onload = () => {
        window.MathJax.Hub.Config({
          tex2jax: {
            inlineMath: [
              ["$", "$"],
              ["$$", "$$"],
            ],
          },
        })
      }

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [])

  const sendData = async () => {
    try {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        console.error("Canvas context not found!")
        return
      }

      // Ensure the canvas is not empty
      const isCanvasEmpty = ctx.getImageData(0, 0, canvas.width, canvas.height).data.every((pixel) => pixel === 0)
      if (isCanvasEmpty) {
        console.error("Canvas is empty! No image to send.")
        notifications.show({
          title: "Error",
          message: "Canvas is empty. Draw something before calculating!",
          color: "red",
        })
        return
      }

      // Convert to Base64 (JPEG to reduce payload size)
      const imageDataURL = canvas.toDataURL("image/jpeg", 0.7) // Lower quality to 70%
      console.log("Image Data Length:", imageDataURL.length)

      // Ensure image data is valid before sending
      if (!imageDataURL.startsWith("data:image/")) {
        throw new Error("Invalid image format detected.")
      }

      const response = await axios.post(
        "/api/calculate",
        {
          image: imageDataURL,
          dict_of_vars: dictOfVars,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const resp = response.data
      console.log("Response:", resp)

      if (resp.type === "error") {
        throw new Error(resp.message || "Unknown error occurred")
      }

      if (!Array.isArray(resp.data)) {
        throw new Error("Invalid response format")
      }

      resp.data.forEach((data: Response) => {
        if (data.assign === true) {
          setDictOfVars((prevVars) => ({
            ...prevVars,
            [data.expr]: data.result,
          }))
        }
      })

      notifications.show({
        title: "Success",
        message: "Calculation completed successfully",
        color: "green",
      })
    } catch (error) {
      console.error("Error sending data:", error)
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to process the image. Please try again.",
        color: "red",
      })
    }
  }

  const resetCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    setLatexExpression([])
    setResults([])
    setDictOfVars({})
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const isTouch = "touches" in e
    const offsetX = isTouch
      ? e.touches[0].clientX - canvasRef.current!.getBoundingClientRect().left
      : (e as React.MouseEvent).nativeEvent.offsetX
    const offsetY = isTouch
      ? e.touches[0].clientY - canvasRef.current!.getBoundingClientRect().top
      : (e as React.MouseEvent).nativeEvent.offsetY

    const canvas = canvasRef.current
    if (canvas) {
      canvas.style.background = "black"
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(offsetX, offsetY)
        setIsDrawing(true)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return
    }
    const isTouch = "touches" in e
    const offsetX = isTouch
      ? e.touches[0].clientX - canvasRef.current!.getBoundingClientRect().left
      : (e as React.MouseEvent).nativeEvent.offsetX
    const offsetY = isTouch
      ? e.touches[0].clientY - canvasRef.current!.getBoundingClientRect().top
      : (e as React.MouseEvent).nativeEvent.offsetY

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.strokeStyle = isEraser ? "black" : color
        ctx.lineWidth = isEraser ? 20 : 3
        ctx.lineTo(offsetX, offsetY)
        ctx.stroke()
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  return (
    <Container fluid>
      <Paper shadow="md" p="md" withBorder>
        <Group position="apart" mb="md">
          <Button onClick={resetCanvas} color="red">
            🔄 Reset
          </Button>
          <Button onClick={sendData} color="blue">
            🧮 Calculate
          </Button>
          <Button onClick={() => setIsEraser((prev) => !prev)} color="gray">
            {isEraser ? "✏️ Draw" : "🧽 Eraser"}
          </Button>
        </Group>
        <Group mb="md">
          {SWATCHES.map((swatch) => (
            <ColorSwatch
              key={swatch}
              color={swatch}
              onClick={() => setColor(swatch)}
              style={{ cursor: "pointer", border: color === swatch ? "2px solid white" : "none" }}
            />
          ))}
        </Group>
      </Paper>
      <canvas
        ref={canvasRef}
        className="w-full h-[calc(100vh-200px)] border border-gray-300"
        style={{ touchAction: "none" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseOut={stopDrawing}
        onMouseUp={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      {latexExpression.map((latex, index) => (
        <Draggable
          key={index}
          defaultPosition={latexPosition}
          onStop={(_, data) => setLatexPosition({ x: data.x, y: data.y })}
        >
          <Paper className="absolute p-2 bg-white rounded shadow-md">
            <Text className="latex-content">{latex}</Text>
          </Paper>
        </Draggable>
      ))}
    </Container>
  )
}

