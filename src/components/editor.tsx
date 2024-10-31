import Quill, { QuillOptions } from 'quill'
import 'quill/dist/quill.snow.css'
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ImageIcon, Smile } from 'lucide-react'
import { EmojiPopover } from './emoji-popover'
import { Button } from './ui/button'
import { PiTextAa } from 'react-icons/pi'
import { MdSend } from 'react-icons/md'
import { Hint } from './hint'
import Delta, { Op } from 'quill-delta'
import { cn } from '@/lib/utils'

type EditorValue = {
  image: File | null
  body: string
}

interface EditorProps {
  variant: 'create' | 'update'
  onSubmit: ({ image, body }: EditorValue) => void
  onCancel?: () => void
  placeholder?: string
  defaultValue?: Delta | Op[]
  disabled?: boolean
  innerRef?: MutableRefObject<Quill | null>
}

const Editor = ({
  variant = 'create',
  onSubmit,
  onCancel,
  placeholder = 'Write Something...',
  defaultValue = [],
  disabled,
  innerRef,
}: EditorProps) => {
  const [text, setText] = useState('')
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true)

  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill | null>(null)
  const defaultValueRef = useRef(defaultValue)
  const containerRef = useRef<HTMLDivElement>(null)
  const disabledRef = useRef(disabled)

  // use Refs in useEffect because of re-rendering
  // refs are not updating on re-render

  useLayoutEffect(() => {
    submitRef.current = onSubmit
    placeholderRef.current = placeholder
    defaultValueRef.current = defaultValue
    disabledRef.current = disabled
  })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const editorContainer = container.appendChild(container.ownerDocument.createElement('div'))

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                return
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n')
              },
            },
          },
        },
      },
    }

    const quill = new Quill(editorContainer, options)
    quillRef.current = quill
    quillRef.current.focus()

    if (innerRef) {
      innerRef.current = quill
    }

    quill.setContents(defaultValueRef.current)
    setText(quill.getText())

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)
      if (container) {
        container.innerHTML = ''
      }
      if (quillRef.current) {
        quillRef.current = null
      }
      if (innerRef) {
        innerRef.current = null
      }
    }
  }, [innerRef])

  const toggleToolbar = () => {
    setIsToolbarVisible(!isToolbarVisible)
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden')
    }
  }

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native)
  }

  const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0

  return (
    <div className='flex flex-col'>
      <div
        className='flex flex-col borber border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition
      bg-white'
      >
        <div ref={containerRef} className='h-full ql-custom' />
        <div className='flex px-2 pb-2 z-[5]'>
          <Hint label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}>
            <Button disabled={disabled} size='iconSm' variant='ghost' onClick={toggleToolbar}>
              <PiTextAa className='size-4' />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size='iconSm' variant='ghost'>
              <Smile className='size-4' />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label='Image'>
              <Button disabled={disabled} size='iconSm' variant='ghost' onClick={() => {}}>
                <ImageIcon className='size-4' />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className='flex flex-auto ml-auto items-center gap-x-2'>
              <Button
                className=''
                variant='outline'
                size='sm'
                onClick={() => {}}
                disabled={disabled}
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                size='sm'
                onClick={() => {}}
                className='bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
              >
                Save
              </Button>
            </div>
          )}
          {variant === 'create' && (
            <Button
              size='iconSm'
              disabled={disabled || isEmpty}
              onClick={() => {}}
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'bg-white hover:bg-white text-muted-foreground'
                  : 'bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
              )}
            >
              <MdSend className='size-4' />
            </Button>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div
          className={cn(
            'p-2 text-[10px] text-muted-foreground flex justify-end opacity-0',
            !isEmpty && 'opacity-100'
          )}
        >
          <p>
            <strong>Shift + Enter</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  )
}

export default Editor
