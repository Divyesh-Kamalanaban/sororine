/**
 * Message Service
 * Business logic for handling user-to-user messaging
 */

import { prisma } from '@/lib/prisma';
import { Message, CreateMessagePayload } from '@/types';

/**
 * Fetch messages between two users
 * Optionally filter by messages after a certain timestamp (for polling optimization)
 */
export async function getMessages(
  user1: string,
  user2: string,
  afterDate?: Date
): Promise<Message[]> {
  try {
    const where: any = {
      OR: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    };

    if (afterDate) {
      where.createdAt = { gt: afterDate };
    }

    return await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.error('[MessageService] Failed to fetch messages:', error);
    throw new Error('Failed to fetch messages');
  }
}

/**
 * Send a message from one user to another
 */
export async function sendMessage(
  payload: CreateMessagePayload
): Promise<Message> {
  const { senderId, receiverId, content } = payload;

  // Validation
  if (!senderId || !receiverId || !content) {
    throw new Error('Missing required fields: senderId, receiverId, content');
  }

  if (!content.trim()) {
    throw new Error('Message content cannot be empty');
  }

  if (senderId === receiverId) {
    throw new Error('Cannot send message to yourself');
  }

  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content: content.trim(),
      },
    });

    return message;
  } catch (error) {
    console.error('[MessageService] Failed to send message:', error);
    throw new Error('Failed to send message');
  }
}

/**
 * Delete a message (admin/mod function)
 */
export async function deleteMessage(messageId: string): Promise<void> {
  try {
    await prisma.message.delete({
      where: { id: messageId },
    });
  } catch (error) {
    console.error('[MessageService] Failed to delete message:', error);
    throw new Error('Failed to delete message');
  }
}

/**
 * Get chat thread count for a user
 * (how many unique people they've chatted with)
 */
export async function getUserChatCount(userId: string): Promise<number> {
  try {
    const sentTo = await prisma.message.findMany({
      where: { senderId: userId },
      distinct: ['receiverId'],
    });

    const receivedFrom = await prisma.message.findMany({
      where: { receiverId: userId },
      distinct: ['senderId'],
    });

    const uniqueUsers = new Set([
      ...sentTo.map((m) => m.receiverId),
      ...receivedFrom.map((m) => m.senderId),
    ]);

    return uniqueUsers.size;
  } catch (error) {
    console.error('[MessageService] Failed to get chat count:', error);
    throw new Error('Failed to get chat count');
  }
}

/**
 * Delete all messages between two users (for cleaning up after help session ends)
 */
export async function clearConversation(user1: string, user2: string): Promise<number> {
  try {
    const result = await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      },
    });

    return result.count;
  } catch (error) {
    console.error('[MessageService] Failed to clear conversation:', error);
    throw new Error('Failed to clear conversation');
  }
}
