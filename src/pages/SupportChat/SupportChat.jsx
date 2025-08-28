import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { FiSend } from "react-icons/fi";
import {
  FaRegCommentDots,
  FaRegSmile,
  FaSun,
  FaMoon,
  FaSearch,
  FaRegClock,
  FaCheck,
} from "react-icons/fa";
import { BsThreeDotsVertical, BsCheck2All } from "react-icons/bs";
import { SOCKET_URL } from "../../utils/ApiBaseUrl";
import { useSelector } from "react-redux";

const SupportChatPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [socket, setSocket] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [UserName, setUserName] = useState(null);
  const [UserId, setUserId] = useState(null);

  const { adminData } = useSelector((state) => state.persist);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      extraHeaders: {
        Authorization: `${adminData?.token}`,
      },
    });

    setSocket(newSocket);

    // Join as admin
    newSocket.emit("joinRoom", { isAdmin: true });

    // ✅ ask server for rooms
    newSocket.emit("getAllRooms");

    // ✅ listen for rooms
    newSocket.on("getAllRooms", (rooms) => {
      console.log("Rooms data:", rooms);
      setChatRooms(rooms); // update state
    });

    // ✅ listen for room messages
    newSocket.on("joinedRoomMessages", (msgs) => {
      if (!msgs.length) return;
      // ✅ derive roomId from message data
      const roomId = msgs[0].chatRoom?.id;

      console.log("Received messages for room:", roomId, msgs);

      setMessages((prev) => ({
        ...prev,
        [roomId]: msgs.map((m) => ({
          id: m.id,
          text: m.message,
          sender: m.typedBy,
          timestamp: new Date(m.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "delivered",
        })),
      }));
    });

    newSocket.on("receiveMessage", (msg) => {
      console.log("📩 New incoming message:", msg);

      
      newSocket.emit("getAllRooms");

      // Assume msg has userId (or you can map via selectedRoom)
      setMessages((prev) => ({
        ...prev,
        [msg.chatRoom]: [
          ...(prev[msg.chatRoom] || []),
          {
            id: msg.id,
            text: msg.message,
            sender: msg.typedBy,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "delivered",
          },
        ],
      }));

    });

    return () => {
      newSocket.disconnect();
    };
  }, [adminData?.token]);

  // const [messages, setMessages] = useState({
  //   1: [
  //     {
  //       id: 1,
  //       text: "Hi, I need help with my booking",
  //       sender: "user",
  //       timestamp: "10:30 AM",
  //       status: "read",
  //     },
  //     {
  //       id: 2,
  //       text: "My booking reference is #BK123456",
  //       sender: "user",
  //       timestamp: "10:31 AM",
  //       status: "read",
  //     },
  //     {
  //       id: 3,
  //       text: "Hello! I'd be happy to help you with your booking. Let me check the details.",
  //       sender: "admin",
  //       timestamp: "10:32 AM",
  //       status: "delivered",
  //     },
  //     {
  //       id: 4,
  //       text: "I can see your booking. What specific issue are you facing?",
  //       sender: "admin",
  //       timestamp: "10:33 AM",
  //       status: "read",
  //     },
  //   ],
  //   2: [
  //     {
  //       id: 1,
  //       text: "I had an issue with my reservation",
  //       sender: "user",
  //       timestamp: "9:15 AM",
  //       status: "read",
  //     },
  //     {
  //       id: 2,
  //       text: "I've resolved the issue for you. Is there anything else I can help with?",
  //       sender: "admin",
  //       timestamp: "9:20 AM",
  //       status: "read",
  //     },
  //     {
  //       id: 3,
  //       text: "Thank you for your help!",
  //       sender: "user",
  //       timestamp: "9:21 AM",
  //       status: "read",
  //     },
  //   ],
  //   3: [
  //     {
  //       id: 1,
  //       text: "Is there any discount available?",
  //       sender: "user",
  //       timestamp: "8:45 AM",
  //       status: "delivered",
  //     },
  //   ],
  //   4: [
  //     {
  //       id: 1,
  //       text: "My payment failed, please help",
  //       sender: "user",
  //       timestamp: "7:30 AM",
  //       status: "delivered",
  //     },
  //     {
  //       id: 2,
  //       text: "I tried multiple times but it keeps failing",
  //       sender: "user",
  //       timestamp: "7:31 AM",
  //       status: "delivered",
  //     },
  //     {
  //       id: 3,
  //       text: "This is really urgent, I need to complete my booking today",
  //       sender: "user",
  //       timestamp: "7:32 AM",
  //       status: "delivered",
  //     },
  //   ],
  // });

  const emojis = [
    "😊",
    "😍",
    "👍",
    "❤️",
    "😂",
    "🎉",
    "👏",
    "🔥",
    "💯",
    "✨",
    "🚀",
    "💪",
  ];

  const filteredRooms = chatRooms.filter((room) => {
    const fullName = `${room.user?.first_name || ""} ${
      room.user?.last_name || ""
    }`.trim();
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSendMessage = () => {
    if (message.trim() && selectedRoom) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: "admin",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };

      setMessages((prev) => ({
        ...prev,
        [selectedRoom]: [...(prev[selectedRoom] || []), newMessage],
      }));

      socket.emit("sendMessage", {
        userId: selectedRoom,
        message,
        typedBy: "admin",
      });

      setMessage("");
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "urgent":
        return "bg-red-500";
      case "active":
        return "bg-green-500";
      case "resolved":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <FaCheck className="w-4 h-4" />;
      case "delivered":
        return <BsCheck2All className="w-4 h-4" />;
      case "read":
        return <BsCheck2All className="w-4 h-4 text-blue-500" />;
      default:
        return <FaRegClock className="w-4 h-4" />;
    }
  };

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-50 text-gray-900";
  const cardClasses = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const inputClasses = isDarkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

  return (
    <div className="w-full px-3">
      <div
        className={`w-full min-h-screen mb-4 rounded-lg border border-primary ${themeClasses} transition-colors duration-300 `}
      >
        {/* Header */}
        <div className={`${cardClasses} border-b border-primary   px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary  rounded-lg">
                <FaRegCommentDots className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Admin Chat Support</h1>
                <p
                  className={`text-sm ${
                    isDarkMode ? "bg-red text-gray-400" : "text-gray-600"
                  }`}
                >
                  Manage customer conversations
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Chat Rooms Sidebar */}
          <div
            className={`w-80 ${cardClasses} border-r border-primary flex flex-col`}
          >
            {/* Chat Rooms List */}
            <div className="flex-1 overflow-y-auto">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => {
                    setSelectedRoom(room.id);
                    setUserName(`${room.first_name} ${room.last_name}`);
                    socket.emit("joinRoom", {
                      isAdmin: false,
                      userId: room.userId,
                    });
                  }}
                  className={`p-4 border-b border-primary  border-primaryborder-gray-100 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selectedRoom === room.id
                      ? "bg-teal-50 dark:bg-teal-900/20 border-l-4 border-l-primary "
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3 ">
                    <div className="relative">
                      <div className="flex items-center justify-center w-12 h-12 font-semibold text-white bg-primary  rounded-full">
                        {room.userAvatar}
                      </div>
                      {room.isOnline && (
                        <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1 dark:border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">
                          {room.first_name} {room.last_name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusColor(
                              room.status
                            )}`}
                          ></div>
                          <span
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {room.timestamp}
                          </span>
                        </div>
                      </div>
                      <p
                        className={`text-sm truncate ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {room.last_message}
                      </p>
                      {room.unreadCount > 0 && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-primary  rounded-full">
                            {room.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col flex-1">
            {selectedRoom ? (
              <>
                {/* Chat Header */}
                <div
                  className={`${cardClasses} border-b border-primary  border-primarypx-6 px-3 py-4`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-primary  rounded-full">
                        {
                          chatRooms.find((room) => room.id === selectedRoom)
                            ?.userAvatar
                        }
                      </div>
                      <div>
                        <h2 className="font-semibold">
                          {
                            chatRooms.find((room) => room.id === selectedRoom)
                              ?.userName
                          }
                        </h2>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {UserName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                  {(messages[selectedRoom] || []).map((msg) => (
                    // {console.log({msg})}
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "admin" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg 
                          bg-primary  text-white
                        `}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <div
                          className={`flex items-center justify-between mt-1 ${
                            msg.sender === "admin"
                              ? "text-teal-100"
                              : isDarkMode
                              ? "text-gray-400"
                              : isDarkMode
                          }`}
                        >
                          <span className="text-xs">{msg.timestamp}</span>
                          {msg.sender === "admin" && (
                            <div className="ml-2">
                              {getMessageStatusIcon(msg.status)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className={`${cardClasses} border-t border-primary p-4`}>
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Type your message..."
                        className={`w-full px-4 py-3 rounded-lg border border-primary ${inputClasses} focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors`}
                      />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`p-3 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                      >
                        <FaRegSmile size={20} />
                      </button>
                      {showEmojiPicker && (
                        <div
                          className={`absolute bottom-full right-0 mb-2 p-3 rounded-lg shadow-lg border border-primary ${cardClasses} grid grid-cols-6 gap-2`}
                        >
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiClick(emoji)}
                              className="p-1 text-xl transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleSendMessage}
                      className="p-3 text-white transition-colors bg-primary  rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!message.trim()}
                    >
                      <FiSend size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full dark:bg-teal-900/20">
                    <FaRegCommentDots className="w-8 h-8 text-primary " />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">
                    Select a conversation
                  </h3>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Choose a conversation from the sidebar to start chatting
                    with users
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChatPage;
