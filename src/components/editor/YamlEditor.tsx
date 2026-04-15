import { yaml } from '@codemirror/lang-yaml'
import { CodeMirrorEditor } from './CodeMirrorEditor'

interface YamlEditorProps {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  className?: string
}

export function YamlEditor({ value, onChange, readOnly, className }: YamlEditorProps) {
  return (
    <CodeMirrorEditor
      value={value}
      onChange={onChange}
      extensions={[yaml()]}
      readOnly={readOnly}
      className={className}
    />
  )
}
