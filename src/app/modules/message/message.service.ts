import mongoose from 'mongoose';
import { IMessage } from './message.interface';
import { Message } from './message.model';
import { Chat } from '../chat/chat.model';
import { JwtPayload } from 'jsonwebtoken';
import { checkMongooseIDValidation } from '../../../shared/checkMongooseIDValidation';
import QueryBuilder from '../../builder/QueryBuilder';
import { Notification } from '../notification/notification.model';
import { User } from '../user/user.model';
import { fcm } from '../../../config/firebase';

// const sendMessageToDB = async (payload: any): Promise<IMessage> => {

//   // save to DB
//   const response = await Message.create(payload);

//   //@ts-ignore
//   const io = global.io;
//   if (io && payload.chatId) {
//     // send message to specific chatId Room
//     io.emit(`getMessage::${payload?.chatId}`, response);
//   }

//   return response;
// };

const sendMessageToDB = async (
  user: JwtPayload,
  payload: any,
): Promise<IMessage> => {
  const senderId = user.id;
  const { chatId , fcmToken} = payload;

  payload.sender = senderId;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error('Invalid chatId');
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error('Chat not found');
  }

  const isParticipant = chat.participants.some(
    participantId => participantId.toString() === senderId,
  );

  if (!isParticipant) {
    throw new Error('You are not a participant in this chat');
  }

  // Save the message
  const message = await Message.create(payload);

  // Get other participants (except sender)
  const otherParticipants = chat.participants.filter(
    p => p.toString() !== senderId,
  );

  const isUserExists = await User.findById(senderId);
  if (!isUserExists) {
    throw new Error('User not found');
  }

  const notifications = otherParticipants.map(receiverId => ({
    text: `${isUserExists.name} sent you a new message.`,
    receiver: receiverId,
    referenceId: message._id,
    screen: 'chat',
    read: false,
  }));

  const createdNotifications = await Notification.insertMany(notifications);

  // Real-time emit to other users
  //@ts-ignore
  const io = global.io;
  if (io && chatId) {
    // Emit message to chat room
    io.emit(`getMessage::${chatId}`, message);

    createdNotifications.forEach(notification => {
      const receiverId = notification.receiver?.toString();
      if (receiverId && io) {
        io.emit(`notification::${receiverId}`, notification);
      }
    });
  }

  return message;
};

// const sendMessageToDB = async (user: JwtPayload, payload: any): Promise<IMessage> => {
//   const senderId = user.id;
//   const { chatId } = payload;

//   // Add sender to payload
//   payload.sender = senderId;

//   // 1. Validate ObjectId format
//   if (!mongoose.Types.ObjectId.isValid(chatId)) {
//     throw new Error("Invalid chatId");
//   }

//   // 2. Find chat
//   const chat = await Chat.findById(chatId);
//   if (!chat) {
//     throw new Error("Chat not found");
//   }

//   // 3. Ensure sender is a participant
//   const isParticipant = chat.participants.some(
//     (participantId) => participantId.toString() === senderId
//   );

//   if (!isParticipant) {
//     throw new Error("You are not a participant in this chat");
//   }

//   // 4. Create message
//   const response = await Message.create(payload);

//   // after create message sent a notification

//   const notification = await Notification.create({})

//   // 5. Emit message to room
//   //@ts-ignore
//   const io = global.io;
//   if (io && chatId) {
//     io.emit(`getMessage::${chatId}`, response);
//   }

//   return response;
// };

const getMessageFromDB = async (
  id: string,
  user: JwtPayload,
  query: Record<string, any>,
): Promise<{ messages: IMessage[]; pagination: any; participant: any }> => {
  checkMongooseIDValidation(id, 'Chat');

  const result = new QueryBuilder(
    Message.find({ chatId: id }).sort({ createdAt: 1 }),
    query,
  ).paginate();
  const messages = await result.modelQuery.exec();
  const pagination = await result.getPaginationInfo();

  const participant = await Chat.findById(id).populate({
    path: 'participants',
    select: '-_id name profile',
    match: {
      _id: { $ne: new mongoose.Types.ObjectId(user.id) },
    },
  });

  return { messages, pagination, participant: participant?.participants[0] };
};

export const MessageService = { sendMessageToDB, getMessageFromDB };
