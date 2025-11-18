'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownPreviewProps {
  content: string
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-blue max-w-none text-gray-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
          li: ({ node, ...props }) => <li className="ml-4" {...props} />,
          code: ({ node, className, children, ...props }) => {
            const inline = !className
            return inline ? (
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props}>
                {children}
              </code>
            )
          },
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
        }}
      >
        {content || '_Предварительный просмотр появится здесь..._'}
      </ReactMarkdown>
    </div>
  )
}
