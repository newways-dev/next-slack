import { LucideIcon } from 'lucide-react'
import { IconType } from 'react-icons/lib'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  label: string
  id: string
  icon: LucideIcon | IconType
  variant?: VariantProps<typeof sidebarItemVariants>['variant']
}

const sidebarItemVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-[#f9edffcc]',
        active: 'text-[#48138] bg-white/90 hober:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export const SidebarItem = ({ label, icon: Icon, id, variant }: SidebarItemProps) => {
  const workspaceId = useWorkspaceId()

  return (
    <Button
      className={cn(sidebarItemVariants({ variant }))}
      variant='transparent'
      size='sm'
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className='size-3.5 mr-1 shrink-0' />
        <span className='text-sm truncate'>{label}</span>
      </Link>
    </Button>
  )
}
