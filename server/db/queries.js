import {prisma} from "./prisma.js"

export async function getUserByUsername(username) { 
    return prisma.user.findUnique({where: {username}});

}

export async function getUserById(id) { 
    return prisma.user.findUnique({
        where: {id},
        select: {id: true,username: true} // don't send back the password even if hashed

    });
}

export async function createUser(username, password) {
    return prisma.user.create({
        data: {username, password},
        select: {id: true, username: true},
    });
}

export async function findConversationBetween(userAId, userBId) {
  return prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: userAId } } },
        { participants: { some: { userId: userBId } } },
        { participants: { every: { userId: { in: [userAId, userBId] } } } },
      ],
    },
  });
}

export async function createConversation(userAId, userBId) {
  return prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId: userAId }, { userId: userBId }],
      },
    },
  });
}

export async function isParticipant(conversationId, userId) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId },
    },
  });
  return Boolean(participant);
}

export async function createMessage(conversationId, senderId, body) {
  return prisma.message.create({
    data: { conversationId, senderId, body },
  });
}

export async function getConversationsForUser(userId) {
  return prisma.conversation.findMany({
    where: {
      participants: { some: { userId } },
    },
    include: {
      participants: {
        where: { userId: { not: userId } },
        select: { user: { select: { id: true, username: true } } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
}

export async function getMessages(conversationId) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, username: true } },
    },
  });
}



