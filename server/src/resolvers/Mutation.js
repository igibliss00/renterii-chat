import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'
import { randomBytes } from 'crypto'
import { promisify } from 'util'
import { transport, makeANiceEmail } from '../mail'
import stripe from '../stripe'
import { OAuth2Client } from "google-auth-library"
import { PUBSUB_NEW_MESSAGE, PUBSUB_NEW_CHANNEL, PUBSUB_NEW_LOCATION, PUBSUB_ONLINE_STATUS } from '../utils/constants';
import { get } from 'http';

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const password = await hashPassword(args.data.password)
        const permissions = "USER"
        const authentication = "REGULAR"
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password,
                permissions,
                authentication
            }
        })
        return {
            user,
            token: generateToken(user.id)
        }
    },
    async login(parent, { data: { email, password }}, { prisma, pubsub }, info) {
        const user = await prisma.mutation.updateUser({
            where: { 
                email: email 
            },
            data: { 
                onlineStatus: "online" 
            },
        })
        
        console.log("login user", user)
        if (!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        pubsub.publish(PUBSUB_ONLINE_STATUS, {
            onlineStatus: user
        })

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async requestReset(parent, args, { prisma }, info) {
        // 1. Check if this is a real user
        const user = await prisma.query.user({ where: { email: args.email } });
        if (!user) {
          throw new Error(`No such user found for email ${args.email}`);
        }
        // 2. Set a reset token and expiry on that user
        const randomBytesPromiseified = promisify(randomBytes);
        const resetToken = (await randomBytesPromiseified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        const res = await prisma.mutation.updateUser({
          where: { email: args.email },
          data: { resetToken, resetTokenExpiry },
        });
        // 3. Email them that reset token
        const mailRes = await transport.sendMail({
          from: 'jeff@renterii.com',
          to: user.email,
          subject: 'Your Password Reset Token',
          html: makeANiceEmail(`Your Password Reset Token is here!
          \n\n
          <a href="${process.env
            .FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`),
        });
    
        // 4. Return the message
        return { message: 'Please check your email!' };
    },
    async resetPassword(parent, args, { prisma }, info) {
        // 1. check if the passwords match
        if (args.password !== args.confirmPassword) {
          throw new Error("Passwords do not match!");
        }
        // 2. check if its a legit reset token
        // 3. Check if its expired
        const [user] = await prisma.query.users({
          where: {
            resetToken: args.resetToken,
            resetTokenExpiry_gte: Date.now() - 3600000,
          },
        })
        if (!user) {
          throw new Error('This token is either invalid or expired!');
        }
        // 4. Hash their new password
        const password = await bcrypt.hash(args.password, 10);
        // 5. Save the new password to the user and remove old resetToken fields
        const updatedUser = await prisma.mutation.updateUser({
          where: { email: user.email },
          data: {
            password,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
        // 6. Generate JWT
        const token = generateToken(updatedUser.id)
        // 7. Return the new user info
        return {
            token,
            user, 
            message: 'Your password has been reset! This page will redirect.'
        }
    },
    async googleLogin(parent, args, { prisma, request }, info) {
        const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization
        let authToken;
        if(header) {
            authToken = header.replace('Bearer ', '')
        } else {
            throw new Error('No header')
        }

        const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)
        let ticket = {};

        try {
            if(authToken) {
                ticket = await client.verifyIdToken({
                    idToken: authToken,
                    audience: process.env.OAUTH_CLIENT_ID
                })
            }
        } catch (err) {
            throw new Error('Unable to authenticate with token', err)
        }
        
        // check if the user exists 
        const user = await prisma.query.user({
            where: {
                email: ticket.getPayload().email
            }
        })

        if(user) {
            return {
                user,
                token: generateToken(user.id)
            }
        } else {
            const { name, email, picture } = ticket.getPayload()
            const randomBytesPromiseified = promisify(randomBytes);
            const password = (await randomBytesPromiseified(20)).toString('hex');
            const user = await prisma.mutation.createUser({
                data: {
                    firstName: name.split(" ")[0],
                    lastName: name.split(" ")[1],
                    password, 
                    email,
                    image: picture,
                    authentication: "OAUTH",
                    permissions: "USER"
                }
            })
            return {
                user,
                token: generateToken(user.id) 
            }
        }

    },
    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)
    },
    async updateUser(parent, { data }, { prisma, request, pubsub }, info) {
        const userId = getUserId(request)

        if (typeof data.password === 'string') {
            args.data.password = await hashPassword(data.password)
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
        })
    },
    async updateOnlineStatus(parent, { data }, { prisma, request, pubsub }, info) {
        const userId = getUserId(request)

        if(!userId){
            throw new Error("You must be logged in!")
        }

        const dbUser = await prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: {
                onlineStatus: data.onlineStatus
            }
        },
            `{
                id
                onlineStatus
            }` 
        )

        pubsub.publish(PUBSUB_ONLINE_STATUS, {
            onlineStatus: dbUser
        })

        return dbUser
    },
    createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const { title, body, location, longitude, latitude, published, price, image, largeImage } = args.data
        return prisma.mutation.createPost({
            data: {
                title,
                body,
                location,
                longitude,
                latitude,
                published,
                price,
                image,
                largeImage,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }   
        }, info)
    },
    async updatePost(parent, args, { prisma, request }, info){
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })
        
        if (!postExists) {
            throw new Error("Unable to update post")
        }

        const isPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        })

        if(isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyReviews({
                where: {
                    post: {
                        id: args.id
                    }
                }
            })
        }
        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        })
    },
    deletePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        if(!userId) {
            throw new Error('You must be logged in')
        }
        const postExists = prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })
        if(!postExists) {
            throw new Error("Unable to delete Post")
        }
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    async createOrder(parent, args, { prisma, request }, info) {
        const userId = await getUserId(request)
        if(!userId) {
            throw new Error("Must be logged in")
        }

        // retrieve the user's cart items
        const user = await prisma.query.user({
            where: {
                id: userId
            }
        },
            `{
                cart 
                {
                    id 
                    startDate
                    endDate 
                    quantity 
                    duration 
                    post { id price author { id } } 
                }
            }`
        )

        if(!user) {
            throw new Error("No user or the cart item found")
        }

        // calculate the tally on the server's side, instead of relying on the front end
        const amount = await user.cart.reduce((tally, cartItem) => tally + cartItem.post.price * cartItem.quantity * cartItem.duration, 0)
        
        // charge the amount to Stripe
        const charge = await stripe.charges.create({
            amount,
            currency: 'CAD',
            source: args.stripeToken
        })

        // convert the cart items to an order
        const bookedItems = user.cart.map(bookedItem => {
            const item = {
                post: {
                    connect: {
                        id: bookedItem.post.id
                    }
                },
                owner: {
                    connect: {
                        id: bookedItem.post.author.id
                    }
                },
                renter: {
                    connect: {
                        id: userId
                    }
                },
                quantity: bookedItem.quantity,
                startDate: bookedItem.startDate,
                endDate: bookedItem.endDate,
                price: bookedItem.post.price,
                overdue: false,
                returned: false,
                borrowing: true,
                inProgress: true
            }
            return item
        })

        // create the order
        const order = await prisma.mutation.createOrder({
            data: {
                posts: { 
                    create: bookedItems 
                },
                user: {
                    connect: {
                        id: userId
                    }
                },
                charge: charge.id,
                total: charge.amount
            }   
        }, info)

        // delete the items in the cart for this particular user
        const cartItemIds = user.cart.map(cartItem => cartItem.id)
        await prisma.mutation.deleteManyCartItems({
            where: {
                id_in: cartItemIds
            }
        })
        return order
    },
    deleteOrder(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        if(!userId) {
            throw new Error("Must be logged in")
        }
        return prisma.mutation.deleteOrder({
            where: {
                id: args.id
            }
        }, info)
    },
    async createReview(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        if(!userId) {
            throw new Error("Must be logged in")
        }
        const postExists = await prisma.exists.Post({
            id: args.data.post,
            published: true 
        })
        if(!postExists) {
            throw new Error("Post not found")
        }
        return prisma.mutation.createReview({
            data: {
                comment: args.data.comment,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },
    async addToCart(parent, args, { prisma, request }, info){
        const userId = getUserId(request)
        if(!userId) {
            throw new Error("Must be logged in")
        }
        const [existingCartItem] = await prisma.query.cartItems({
            where: {
                user: { 
                    id: userId 
                },
                post: { 
                    id: args.data.id 
                }
            }
        })   

        if(existingCartItem) {
            return prisma.mutation.updateCartItem({
                where: {
                    id: existingCartItem.id
                },
                data: {
                    quantity: args.data.quantity,
                    startDate: args.data.startDate,
                    endDate: args.data.endDate,
                    duration: args.data.duration
                }
            }, info)
        }
        return prisma.mutation.createCartItem({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.id
                    }
                },
                startDate: args.data.startDate,
                endDate: args.data.endDate,
                duration: args.data.duration
            }
        }, info)
    },
    async removeFromCart(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        if(!userId) throw new Error('You must be logged in!')
        const cartItem = await prisma.query.cartItem({
            where: {
                id: args.id
            }
        }, `{ user { id }}`)
        if(!cartItem) throw new Error('Cart item not found!')
        if(cartItem.user.id !== userId ) throw new Error('You are not authorized')
        return prisma.mutation.deleteCartItem({
            where: {
                id: args.id
            }
        }, info) 
    },
    async createChannel(parent, { id }, { request, prisma }, info) {
        const userId = getUserId(request)
        if(!userId) {
            throw new Error("You must be logged in!")
        }
        
        // checked for existing channels and select the last updated one
        const [channelExists] = await prisma.query.channels({
            where: {
                AND: [{
                    members_some: {
                        id: userId
                    }
                }, {
                    members_some: {
                        id
                    }
                }]
            },
            last: 1
        },
            `{
                id
                members {
                    id
                    firstName
                }
                updatedAt
            }`
        )

        if(channelExists) {
            return channelExists
        }
        return prisma.mutation.createChannel({
                data: {
                    members: {
                        connect: [{
                            id
                        }, {
                            id: userId
                        }]
                    },
                    
                }
        }, info)
    },
    async createMessage(parent, { data: { text, image, largeImage, chatterId, channel, status, isTyping, post } }, { prisma, request, pubsub }, info) {
        const userId = getUserId(request)
        if(!userId) {
            throw new Error('You must be logged in!')
        }
        let dbMessage;
        if(!post) {
            dbMessage = await prisma.mutation.createMessage({
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    text,
                    image,
                    largeImage,
                    chatterId,
                    channel: {
                        connect: {
                            id: channel
                        }
                    },
                    status,
                    isTyping,
                }
            },
                `{
                    id
                    chatterId
                    createdAt
                    text
                    image
                    channel {
                        id
                    }
                    user {
                        id
                        firstName
                    }
                    status
                    isTyping
                    post {
                        id
                        title
                        body
                        price
                        image
                    }
                }` 
            )
        } else {
            // create a message and retrieve the message back for subscription
            dbMessage = await prisma.mutation.createMessage({
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    text,
                    image,
                    largeImage,
                    chatterId,
                    channel: {
                        connect: {
                            id: channel
                        }
                    },
                    status,
                    isTyping,
                    post: {
                        connect: {
                            id: post
                        }
                    }
                }
            },
                `{
                    id
                    chatterId
                    createdAt
                    text
                    image
                    channel {
                        id
                    }
                    user {
                        id
                        firstName
                    }
                    status
                    isTyping
                    post {
                        id
                        title
                        body
                        price
                        image
                    }
                }` 
            )
        }

        if(!dbMessage.isTyping) {
            const messageDeleted = await prisma.mutation.deleteManyMessages({
                where: {
                    AND: [{
                        isTyping: true
                    },{
                        user: {
                            id: userId
                        }
                    }]
                }
            })
            console.log("messageDeleted", messageDeleted)
        }

        pubsub.publish(PUBSUB_NEW_MESSAGE, {
            newMessage: dbMessage
        })
        
        const dbChannel = await prisma.query.channel({
            where: {
                id: channel
            }
        },
            `{
                id
                updatedAt
                members {
                    id
                    firstName
                }
                text(orderBy: updatedAt_DESC, last: 1) {
                    text
                }
            }` 
        )

        pubsub.publish(PUBSUB_NEW_CHANNEL, {
            newChannel: dbChannel
        })
        
        return true
    },
    async createLocation(parent, { data: { longitude, latitude, channel, isShared }}, { request, prisma, pubsub }, info){
        const userId = getUserId(request)
        if(!userId) {
            throw new Error("You must be logged in!")
        }
        const yourLocation = await prisma.mutation.createLocation({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                longitude,
                latitude,
                channel: {
                    connect: {
                        id: channel
                    }
                },
                isShared
            }
        }, 
            `{
                channel {
                    id
                }
                id
                longitude
                latitude
                isShared
                user {
                    id
                }
            }`
        )

        // check for the other party's location sharing 
        const [theirLocation] = await prisma.query.locations({
            where: {
                AND: [{
                    user: {
                        id_not: userId
                    }, 
                    channel: {
                        id: channel
                    },
                    isShared: true
                    }],
            },
            last: 1,
        },
            `{
                channel {
                    id
                }
                id
                longitude
                latitude
                isShared
                user {
                    id
                }
            }`
        )

        const locations = []
        locations.push(yourLocation, theirLocation)
        locations.map(location => {
            if(!location) {
                return
            }
            pubsub.publish(PUBSUB_NEW_LOCATION, {
                    newLocation: location
            })
        })

        return true
    },
    async deleteLocation(parent, { channel }, { request, prisma }, info) {
        const userId = getUserId(request)
        if(!userId) {
            throw new Error("You must be logged in!")
        }
        const response = await prisma.mutation.deleteManyLocations({
            where: {
                channel: {
                    id: channel
                }
            }
        })

        console.log("response", response)
        return true
    },
}

export { Mutation as default }

