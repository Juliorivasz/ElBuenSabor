"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  useWebSocket,
  saveChatMessage,
  getChatMessages,
  clearChatMessages,
  saveUnreadCount,
  getUnreadCount,
} from "../../hooks/useWebSocket";
import type { IMessage } from "@stomp/stompjs";

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface FixedChatProps {
  userRole: "Cocinero" | "Cajero";
}

export const FixedChat: React.FC<FixedChatProps> = ({ userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isConnected, subscribe, sendMessage } = useWebSocket();

  // Cargar mensajes y contador de no leídos al inicializar
  useEffect(() => {
    const savedMessages = getChatMessages();
    const savedUnreadCount = getUnreadCount();

    setMessages(savedMessages);
    setUnreadCount(savedUnreadCount);
  }, []);

  // Guardar contador de no leídos cuando cambie
  useEffect(() => {
    saveUnreadCount(unreadCount);
  }, [unreadCount]);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat expands
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // WebSocket subscription for receiving messages
  useEffect(() => {
    if (isConnected) {
      console.log("Chat: Suscribiéndose a /topic/public");
      const unsubscribe = subscribe("/topic/public", (message: IMessage) => {
        try {
          const chatMessage = JSON.parse(message.body);
          console.log("Chat: Mensaje recibido:", chatMessage);

          const newChatMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: chatMessage.sender,
            content: chatMessage.content,
            timestamp: chatMessage.timestamp,
            isOwn: chatMessage.sender === userRole,
          };

          // Guardar mensaje en localStorage
          saveChatMessage(newChatMessage);

          // Actualizar estado local
          setMessages((prev) => [...prev, newChatMessage]);

          // Increment unread count if chat is collapsed and message is not from current user
          if (!isExpanded && !newChatMessage.isOwn) {
            setUnreadCount((prev) => prev + 1);
          }
        } catch (error) {
          console.error("Chat: Error al parsear mensaje:", error);
        }
      });

      return () => {
        console.log("Chat: Desuscribiéndose de /topic/public");
        unsubscribe();
      };
    }
  }, [isConnected, subscribe, userRole, isExpanded]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const messageToSend = {
      sender: userRole,
      content: newMessage.trim(),
      timestamp: timestamp,
    };

    console.log("Chat: Enviando mensaje:", messageToSend);
    sendMessage("/app/chat.sendMessage", messageToSend);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setUnreadCount(0); // Reset unread count when opening chat
    }
  };

  const handleClearChat = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar todo el historial del chat?")) {
      clearChatMessages();
      setMessages([]);
      setUnreadCount(0);
    }
  };

  const getRoleColor = (sender: string) => {
    switch (sender) {
      case "Cocinero":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Cajero":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        // Chat Window - only show when expanded
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <ChatIcon fontSize="small" />
              <div>
                <span className="font-semibold text-sm">Chat - {userRole}</span>
                <div className="flex items-center text-xs opacity-90">
                  {isConnected ? (
                    <>
                      <WifiIcon
                        fontSize="inherit"
                        className="mr-1"
                      />
                      Conectado
                    </>
                  ) : (
                    <>
                      <WifiOffIcon
                        fontSize="inherit"
                        className="mr-1"
                      />
                      Desconectado
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {/* Clear Chat Button */}
              <button
                onClick={handleClearChat}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                title="Borrar historial del chat">
                <DeleteIcon fontSize="small" />
              </button>
              {/* Close Button */}
              <button
                onClick={toggleChat}
                className="hover:bg-white/20 rounded-full p-1 transition-colors">
                <CloseIcon fontSize="small" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <ChatIcon
                  className="mx-auto mb-2 text-gray-400"
                  fontSize="large"
                />
                <p className="text-sm">No hay mensajes aún</p>
                <p className="text-xs">Inicia la conversación</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"}`}>
                  {/* Role Badge */}
                  <div className={`text-xs px-2 py-1 rounded-full mb-1 border ${getRoleColor(message.sender)}`}>
                    {message.sender}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-xs px-3 py-2 rounded-2xl ${
                      message.isOwn
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                    }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
                disabled={!isConnected}
                className="text-gray-700 flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors">
                <SendIcon fontSize="small" />
              </button>
            </div>
            {!isConnected && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <WifiOffIcon
                  fontSize="inherit"
                  className="mr-1"
                />
                Sin conexión al servidor
              </p>
            )}
          </div>
        </div>
      ) : (
        // Chat Toggle Button - only show when collapsed
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 relative">
          <ChatIcon />

          {/* Unread Messages Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}

          {/* Connection Status Indicator */}
          <div
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </button>
      )}
    </div>
  );
};
