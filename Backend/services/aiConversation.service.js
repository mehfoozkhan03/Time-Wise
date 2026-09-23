import { AIConversation } from "../models/AIConversation.model.js";

// ==================================================
// GET CONVERSATION
// Optionally limit to last N messages for chat persistence
// ==================================================

export const getConversation = async (userID, options = {}) => {
  const { limit } = options;

  const conversation = await AIConversation.findOne({
    user: userID,
  }).lean();

  if (!conversation) {
    return {
      messages: [],
      pendingRequests: [],
    };
  }

  const allMessages = conversation.messages || [];

  // If limit is specified, return only the last N messages
  // Otherwise return all messages
  const messages = limit && limit > 0 ? allMessages.slice(-limit) : allMessages;

  return {
    messages,
    pendingRequests: conversation.pendingRequests || [],
    // Include metadata about total message count
    totalMessageCount: allMessages.length,
  };
};

// ==================================================
// ADD MESSAGE
// ==================================================

export const addConversationMessage = async (userID, role, content) => {
  let conversation = await AIConversation.findOne({
    user: userID,
  });

  if (!conversation) {
    conversation = new AIConversation({
      user: userID,
      messages: [],
      pendingRequests: [],
    });
  }

  conversation.messages.push({
    role,
    content,
  });

  await conversation.save();
};

// ==================================================
// GET PENDING REQUESTS
// ==================================================

export const getPendingRequests = async (userID) => {
  const conversation = await AIConversation.findOne({
    user: userID,
  }).lean();

  return conversation?.pendingRequests || [];
};

// ==================================================
// SAVE PENDING REQUESTS
// ==================================================

export const savePendingRequests = async (userID, pendingRequests) => {
  let conversation = await AIConversation.findOne({
    user: userID,
  });

  if (!conversation) {
    conversation = new AIConversation({
      user: userID,
      messages: [],
      pendingRequests: [],
    });
  }

  conversation.pendingRequests = pendingRequests || [];

  await conversation.save();
};

// ==================================================
// CLEAR PENDING REQUESTS
// ==================================================

export const clearPendingRequests = async (userID) => {
  await AIConversation.updateOne(
    {
      user: userID,
    },
    {
      $set: {
        pendingRequests: [],
      },
    },
  );
};

// ==================================================
// CLEAR CONVERSATION
// ==================================================

export const clearConversation = async (userID) => {
  await AIConversation.deleteOne({
    user: userID,
  });
};
