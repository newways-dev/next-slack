import { getAuthUserId } from '@convex-dev/auth/server'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (context, args) => {
    const userId = await getAuthUserId(context)

    if (!userId) throw new Error('Unauthorized')

    const joinCode = '123456'
    const workspaceId = await context.db.insert('workspaces', {
      name: args.name,
      userId,
      joinCode,
    })

    return workspaceId
  },
})

export const get = query({
  args: {},
  handler: async (context) => {
    return await context.db.query('workspaces').collect()
  },
})

export const getById = query({
  args: { id: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) throw new Error('User unauthorized')

    return await ctx.db.get(args.id)
  },
})
