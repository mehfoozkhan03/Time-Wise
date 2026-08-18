const conversations = new Map();

const MAX_MESSAGES = 6;

export const getConversation = (userID) => {
  return conversations.get(userID) || [];
};

export const addConversationMessage = (userID, role, content) => {
  const conversation = conversations.get(userID) || [];

  conversation.push({
    role,
    content,
  });

  // Keep only the latest messages
  if (conversation.length > MAX_MESSAGES) {
    conversation.splice(0, conversation.length - MAX_MESSAGES);
  }

  conversations.set(userID, conversation);
};

export const clearConversation = (userID) => {
  conversations.delete(userID);
};
