import { useState } from "react"
import YouTube, { type YouTubeProps } from "react-youtube"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Editor } from "@monaco-editor/react"

// Types
import type { ChapterContentType, ChapterType, CourseType } from "@/types/resume.type"
import { executeCode } from "../_utils/codeExecution"

type ChapterContentProps = {
  course: CourseType
  chapter: ChapterType | null
  content: ChapterContentType | null
  handleNext: () => void
}

const videoOpts = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: 0,
  },
}

const ChapterContent = ({ course, chapter, content, handleNext }: ChapterContentProps) => {
  const [outputs, setOutputs] = useState<{ [key: string]: string | null }>({})
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const [editedCode, setEditedCode] = useState<{ [key: string]: string }>({})

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    event.target.pauseVideo()
  }

  const runCode = async (exampleId: string) => {
    setLoading((prev) => ({ ...prev, [exampleId]: true }))
    setOutputs((prev) => ({ ...prev, [exampleId]: null }))

    const codeToRun = editedCode[exampleId] || ""
    const language =
      content?.content.flatMap((item) => item.code_examples || []).find((example, index) => `${index}` === exampleId)
        ?.language || "python"

    try {
      const result = await executeCode(language, codeToRun)
      setOutputs((prev) => ({
        ...prev,
        [exampleId]: result.run.output || "Code executed successfully, but there was no output.",
      }))
    } catch (error) {
      console.error("Error executing code:", error)
      setOutputs((prev) => ({
        ...prev,
        [exampleId]: `Error: ${error instanceof Error ? error.message : "An unexpected error occurred"}`,
      }))
    } finally {
      setLoading((prev) => ({ ...prev, [exampleId]: false }))
    }
  }

  const handleEditorChange = (value: string | undefined, exampleId: string) => {
    if (value !== undefined) {
      setEditedCode((prev) => ({ ...prev, [exampleId]: value }))
    }
  }

  return (
    <div className="p-10 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h2 className="font-semibold text-3xl text-gray-800 dark:text-gray-100 mb-2">{chapter?.chapter_name}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{chapter?.description}</p>

      {/* Video Section */}
      <div className="flex justify-center my-6">
        <YouTube videoId={content?.videoId} opts={videoOpts} onReady={onPlayerReady} />
      </div>

      {/* Content Section */}
      <div>
        {content?.content.map((item, contentIndex) => (
          <div key={contentIndex} className="my-5 bg-gray-200 dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="font-medium text-xl text-gray-800 dark:text-gray-100 mb-3">{item.title}</h2>
            <ReactMarkdown className="prose dark:prose-dark mb-3">{item.explanation}</ReactMarkdown>
            {item.code_examples && item.code_examples.length > 0 && (
              <div className="mt-3">
                {item.code_examples.map((example, exampleIndex) => {
                  const exampleId = `${contentIndex}-${exampleIndex}`
                  const initialCode = Array.isArray(example.code)
                    ? example.code.join("\n").replace("<pre><code>", "").replace("</pre></code>", "")
                    : (example.code as string).replace("<pre><code>", "").replace("</code></pre>", "")

                  return (
                    <div key={exampleId} className="mb-6">
                      <Editor
                        height="300px"
                        defaultLanguage={example.language || "python"}
                        value={editedCode[exampleId] || initialCode}
                        onChange={(value) => handleEditorChange(value, exampleId)}
                        options={{
                          minimap: { enabled: true },
                          scrollBeyondLastLine: false,
                          fontSize: 14,
                          theme: "vs-dark",
                        }}
                      />
                      <Button
                        onClick={() => runCode(exampleId)}
                        className="mt-3 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
                        disabled={loading[exampleId]}
                      >
                        {loading[exampleId] ? "Running..." : "Run Code"}
                      </Button>
                      {/* Output Section */}
                      {outputs[exampleId] !== undefined && outputs[exampleId] !== null && (
                        <div className="mt-4 p-4 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-inner">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Output:</h3>
                          <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto">
                            {outputs[exampleId]}
                          </pre>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Take a Quiz Button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleNext}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Take a Quiz
        </Button>
      </div>
    </div>
  )
}

export default ChapterContent

