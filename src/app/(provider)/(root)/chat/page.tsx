import React from 'react';
import ChatList from "./_components/ChatList";

const ChatPage = () => {
  return (
    <div className="flex">
      <ChatList />
      <div className="flex-grow">
        {/* <Chat /> */}
      </div>
    </div>
  );
};

export default ChatPage;