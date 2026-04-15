import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { CodeMirrorEditor } from './CodeMirrorEditor'

interface MarkdownEditorProps {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  className?: string
}

export function MarkdownEditor({ value, onChange, readOnly, className }: MarkdownEditorProps) {
  return (
    <CodeMirrorEditor
      value={value}
      onChange={onChange}
      extensions={[markdown({ base: markdownLanguage })]}
      readOnly={readOnly}
      className={className}
    />
  )
}
