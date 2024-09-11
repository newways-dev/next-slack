import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUpdateWorkspace } from '@/features/workspaces/api/user-update-workspace'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'

interface PreferencesModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  initialValue: string
}

export const PreferencesModal = ({
  setOpen,
  open,
  initialValue,
}: PreferencesModalProps) => {
  const [value, setValue] = useState(initialValue)
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
        <DialogHeader className='p-4 border-b bg-white'>
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>
        <div className='px-4 flex flex-col pb-4 gap-y-2'>
          <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-semibold'>Workspace name</p>
              <p className='text-sm text-[#1264a3] hover:underline font-semibold'>
                Edit
              </p>
            </div>
            <p className='text-sm'>{value}</p>
          </div>
          <button
            className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-red-600'
            disabled={false}
            onClick={() => {}}
          >
            <TrashIcon />
            <p className='text-sm font-semibold'>Delete workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
