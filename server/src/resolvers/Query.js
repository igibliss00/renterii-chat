import getUserId from '../utils/getUserId'
import { hasPermission } from '../utils/hasPermission';
import { forwardTo } from 'prisma-binding';

const Query = {
    async users(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        if(!userId){
            throw new Error('You must be logged in!')
        }
        const user = await prisma.query.user({
            where: {
                id: userId
            }
        }, `{ permissions }`)
        if(!user) {
            throw new Error('User does not exist')
        }

        hasPermission(user, "ADMIN")
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }
        
        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info)  
    },
    user(parent, args, { prisma }, info) {
        if(!args.id) {
            throw new Error("No search query input")
        }
        const opArgs = {
            where: {
                id: args.id
            }
        }
        return prisma.query.user(opArgs, info)
    },
    posts(parent, { first, skip, after, orderBy, id, query, author }, { prisma }, info) {
        const opArgs = {
            first,
            skip,
            after,
            orderBy,
            where: {
                published: true
            }
        }
        if(id) {
            opArgs.where = {
                id
            }
        } else if(query) {
            opArgs.where.OR = [{
                title_contains: query
            }, {
                body_contains: query
            }]
        } else if(author) {
            opArgs.where = {
                author: {
                    id: author
                }
            }
        }
        return prisma.query.posts(opArgs, info)
    },
    post(parent, args, { prisma }, info) {
        if(!args.id) {
            throw new Error("No search query input")
        }
        const opArgs = {
            where: {
                id: args.id
            }
        }
        return prisma.query.post(opArgs, info)
    },
    reviews(parent, args, { prisma }, info) {
      const opArgs = {
          first: args.first,
          skip: args.skip,
          after: args.after,
          orderBy: args.orderBy
      }
      if(args.query) {
        opArgs.where.OR = [{
            title_contains: args.query
            }, {
            body_contains: args.query
            }]
        }
        return prisma.query.reviews(opArgs, info)
    },
    bookings(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
        }
        if(args.id) {
            opArgs.where = {
                id: args.id
            }
        }
        return prisma.query.bookings(opArgs, info)
    },
    orders(parent, args, { prisma, request }, info){
        const userId = getUserId(request)
        if(!userId) {
            throw new Error("You must be logged in!")
        }
        const opArgs = {
            orderBy: args.orderBy
        }
        return prisma.query.orders(opArgs, info)
    },
    async order(parent, args, { prisma, request }, info){
        const userId = getUserId(request)
        if(!userId){
            throw new Error("You need to be logged in!")
        }

        const user = await prisma.query.user({
            where: {
                id: userId
            }
        })
        hasPermission(user, 'ADMI')
        return prisma.query.order({
            where: {
                id: args.id
            }
        }, info)
    },
    cart(parent, args, { prisma, request }, info){
        const userId = getUserId(request)
        if(!userId) {
            return null
        }
        // if(!userId) {
        //     throw new Error("Please login")
        // }
        const opArgs = {
            where: {
                user: {
                    id: userId
                }
            }
        }
        return prisma.query.cartItems(opArgs, info)
    },
    me(parent, args, { prisma, request }, info){
        const userId = getUserId(request)
        return prisma.query.user({
            where: {
                id: userId
            }
        }, info)
    },
    postsConnection: forwardTo('prisma'),
    messages(parent, { channel }, { prisma }, info){
        const opArgs = {
            where: {
                channel: {
                    id: channel
                }
            }
        }
        return prisma.query.messages(opArgs, info)
    },
    async channels(parent, args, { request, prisma }, info) {
        const userId = getUserId(request)
        if(!userId) {
            throw new Error("You must be logged in!")
        }

        const opArgs = {
            where: {
                members_some: {
                    id: userId
                }
            },
            orderBy: "updatedAt_DESC"
        }

        return prisma.query.channels(opArgs, 
            `{
                id
                members {
                    id    
                    firstName
                }
                updatedAt
                text(orderBy: updatedAt_DESC, last: 1) {
                    text
                }
            }`
        )
    },
    async locations(parent, args, { request, prisma }, info){
        const userId = getUserId(request)
        if(!userId) {
            throw new Error("You must be logged in!")
        }

        const [yourLocation] = await prisma.query.locations({
            where: {
                AND: [{
                    user: {
                        id: userId
                    },
                    isShared: true
                    }],
            },
            last: 1,
        }, info)

        console.log("yourLocation from query", yourLocation)

        return yourLocation
    }
}

export { Query as default }