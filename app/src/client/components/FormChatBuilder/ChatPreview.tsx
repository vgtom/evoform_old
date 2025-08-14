import React, { useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Send } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { FieldType } from "@prisma/client";
import { useQuery } from "wasp/client/operations";
import { useFormBuilderStore } from "../../store";

type Message = {
  sender: "OTHER" | "ME";
  text: string;
  type: FieldType;
};

const ChatPreview = () => {
  const { storedForm } = useFormBuilderStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastSentFieldIndex, setLastSentFieldIndex] = useState(0);
  const [input, setInput] = useState("");

  const lastMessage = messages?.length
    ? messages[messages.length - 1]
    : undefined;

  useEffect(() => {
    // Only send the first question on initial load
    if (
      messages.length === 0 &&
      storedForm?.fields?.length &&
      lastSentFieldIndex === 0
    ) {
      const currentField = storedForm.fields[0];
      setMessages([
        {
          sender: "OTHER",
          text: currentField.title || "",
          type: currentField.type || "SHORT_TEXT",
        },
      ]);
      setLastSentFieldIndex(1);
    }
  }, [storedForm?.fields]);

  useEffect(() => {
    // Send next question after user responds
    if (
      lastMessage?.sender === "ME" &&
      lastSentFieldIndex < (storedForm?.fields?.length || 0)
    ) {
      const currentField = storedForm?.fields[lastSentFieldIndex];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "OTHER",
            text: currentField?.title || "",
            type: currentField?.type || "SHORT_TEXT",
          },
        ]);
        setLastSentFieldIndex((prev) => prev + 1);
      }, 500); // Small delay to simulate typing
    }
  }, [lastMessage?.sender]);

  const handleSendMessageClick = () => {
    if (!input.trim()) return; // Don't send empty messages

    setMessages((prev) => [
      ...prev,
      { sender: "ME", text: input, type: "SHORT_TEXT" },
    ]);

    setInput(""); // Clear input after sending
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessageClick();
    }
  };

  return (
    <div className="h-full min-h-[500px] bg-gray-100 grid grid-rows-[1fr_max-content] bg-gradient-to-t from-green-100 to-green-50 shadow">
      <div className="p-4 overflow-y-auto space-y-2">
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "ME" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                message.sender === "ME"
                  ? "bg-green-500 text-white rounded-br-sm rounded-tr-none"
                  : "bg-white text-gray-800 shadow-sm rounded-bl-sm rounded-tl-none"
              }`}
            >
              {message.text}
              {/* WhatsApp-style arrow */}
              <div
                className={`absolute top-0 w-0 h-0 ${
                  message.sender === "ME"
                    ? "right-0 transform translate-x-full border-l-8 border-l-green-500 border-t-8 border-t-transparent border-b-8 border-b-transparent"
                    : "left-0 transform -translate-x-full border-r-8 border-r-white border-t-8 border-t-transparent border-b-8 border-b-transparent"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 ">
        <div className="flex gap-2 items-center ">
          <div className="bg-white rounded-full flex-1 flex items-center px-4 py-2 border border-green-700">
            <Input
              placeholder="Type a message..."
              variant="ghost"
              className="border-none bg-transparent focus:outline-none flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button
            className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600 border border-green-700"
            onClick={handleSendMessageClick}
            disabled={!input.trim()}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;
