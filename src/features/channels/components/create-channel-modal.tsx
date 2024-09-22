import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreateChannelModal } from '../store/use-create-channel-modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useCreateChannel } from '../api/user-create-channel'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const CreateChannelModal = () => {
  const [open, setOpen] = useCreateChannelModal()
  const { mutate, isPending } = useCreateChannel()
  const [name, setName] = useState<string>('')
  const workspaceId = useWorkspaceId()
  const router = useRouter()

  const handleClose = () => {
    setName('')
    setOpen(false)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-'.toLowerCase())
    setName(value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate(
      {
        name,
        workspaceId,
      },
      {
        onSuccess: (id) => {
          router.push(`/workspace/${workspaceId}/channel/${id}`)
          toast.success('channel created')
          handleClose()
        },
        onError: () => toast.error('Failed to create channel'),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder='e.g. plan-budget'
          />
          <div className='flex justify-end'>
            <Button disabled={false}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
