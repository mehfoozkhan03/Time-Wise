import { AIConversation } from "../models/AIConversation.model.js";

// ==================================================
// GET CONVERSATION
// ==================================================

export const getConversation = async (userID) => {
  const conversation = await AIConversation.findOne({
    user: userID,
  }).lean();

  if (!conversation) {
    return [];
  }

  return conversation.messages || [];
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
    });
  }

  conversation.messages.push({
    role,
    content,
  });

  await conversation.save();
};

// ==================================================
// CLEAR CONVERSATION
// ==================================================

export const clearConversation = async (userID) => {
  await AIConversation.deleteOne({
    user: userID,
  });
};
