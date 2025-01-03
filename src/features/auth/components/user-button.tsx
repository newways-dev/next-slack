'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UseCurrentUser } from '../api/use-current-user'
import { Loader, LogOutIcon } from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'

export const UserButton = () => {
  const { signOut } = useAuthActions()
  const { data, isLoading } = UseCurrentUser()

  if (isLoading) {
    return <Loader className='size-4 animate-spin text-muted-foreground' />
  }

  if (!data) {
    return null
  }

  const { name, image } = data

  const avatarFallback = name!.charAt(0).toLocaleUpperCase()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='outline-none relative'>
        <Avatar className='rounded-md size-10 hover:opacity-75 transition'>
          <AvatarImage className='rounded-md' alt={name} src={image} />
          <AvatarFallback className='rounded-md text-sky-500'>{avatarFallback}</AvatarFallback>
        </Avatar>
        <DropdownMenuContent align='center' side='right' className='w-60'>
          <DropdownMenuItem onClick={() => signOut()} className='h-10'>
            <LogOutIcon className='size-4 mr-2' />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
