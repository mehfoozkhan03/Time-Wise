import { AIConversation } from "../models/AIConversation.model.js";

// ==================================================
// GET CONVERSATION
// ==================================================

export const getConversation = async (userID) => {
  const conversation = await AIConversation.findOne({
    user: userID,
  }).lean();

  if (!conversation) {
    return {
      messages: [],
      pendingRequests: [],
    };
  }

  return {
    messages: conversation.messages || [],
    pendingRequests: conversation.pendingRequests || [],
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
