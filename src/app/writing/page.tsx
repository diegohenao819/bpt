"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../../components/ui/button";
import Writing from "../../images/writing.jpg";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: string;
  content: string;
}

const ChatForm = () => {
  const [inputValue, setInputValue] = useState("");
  const [allMessages, setAllMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "You are a writing assistant. The user will send you a response paragraph, you will create a table giving feedback on the paragraph. If the user does not send a response paragraph, you will respond that you will wait for the user to send a response paragraph. In the table, you need to give feedback telling the user if the paragraph meets the correct requirements. These are the rubrics:  1) Topic Setence: Clearly presents a concise and focused topic sentence that accurately reflects the main idea of the response paragraph and catches the audiences attention. 2) Synthesis of authors arguments: Demonstrates a synthesis of the author's argument, and the key pts in a coherent and concise manner. 3) Reaction and Arguments: Provides a thoughtful and well-justified analysis of the speaker's claim, supported by the identification of its pros and cons. 4) Conclusion: Offers a strong and concise conclusion that effectively summarizes the main pts or makes a final reflection or adds further information. 5) Language Use: Demonstrates effective use of simple language with minimal errors in grammar, spelling, and sentence structure within. From 0 to 5 mistakes. 6) Word Limit: The word limit isn’t exceeded more or less than 5% = from 190 to 210 words. Finally, make a list of all the grammar mistakes and rewrite the paragraph with the corrections.",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const messageEntry = formData.get("message");

    if (typeof messageEntry !== "string") {
      console.error("El mensaje no es una cadena de texto");
      return;
    }

    const message = messageEntry;

    const updatedMessages: Message[] = [
      ...allMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ];

    setAllMessages(updatedMessages);
    setInputValue("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ allMessages: updatedMessages }),
    });

    if (!response.body) {
      console.error("La respuesta no tiene cuerpo");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      const chunk = decoder.decode(value, { stream: true });

      setAllMessages((prevMessages) => {
        const messages = prevMessages.map((message, index) => {
          if (index === prevMessages.length - 1) {
            return { ...message, content: message.content + chunk };
          } else {
            return message;
          }
        });
        return messages;
      });
    }
  };

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableArea = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLElement | null;
      if (scrollableArea) {
        scrollableArea.scrollTop = scrollableArea.scrollHeight;
      }
    }
  }, [allMessages]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Adjust height to content
    }
  };

  const markdownComponents: Components = {
    table: (props) => (
      <div className="overflow-x-auto">
        <table className="border-collapse w-full min-w-[600px]" {...props} />
      </div>
    ),
    th: (props) => (
      <th
        className="border border-gray-300 px-4 py-2 bg-gray-200 text-left text-gray-800"
        {...props}
      />
    ),
    td: (props) => (
      <td className="border border-gray-300 px-4 py-2 text-left" {...props} />
    ),
  };

  return (
    <div className="w-[80%] bg-gray-200 m-auto">
      {allMessages.length === 1 ? (
        <ScrollArea ref={scrollAreaRef} className="rounded-md border">
          <div
            className="flex flex-col justify-center items-center align-middle
           p-4 text-black"
          >
            <h2 className="text-black font-bold text-2xl mb-4 mt-2">
              Send your Reponse Paragraph to get Instant Feedback!!
            </h2>
            <Image src={Writing} alt="ChatGPT" width={400} height={400} />
          </div>
        </ScrollArea>
      ) : (
        <ScrollArea ref={scrollAreaRef} className="rounded-md border h-[550px]">
          <div className="ml-4 mr-4 p-4">
            {allMessages.map((message, index) => {
              if (message.role === "system") {
                return null;
              }

              return (
                <div
                  key={index}
                  className={
                    message.role === "user" ? "text-right" : "text-blue-300"
                  }
                >
                  <strong
                    className={
                      message.role === "user"
                        ? "text-white mt-2 text-md"
                        : "text-blue-800"
                    }
                  >
                    {message.role === "user" ? "" : "Assistant:"}
                  </strong>
                  <div
                    className={
                      message.role === "assistant"
                        ? "text-black mt-2"
                        : "text-white mt-2 bg-blue-900 p-2 rounded-md"
                    }
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <Separator className="my-2" />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}

      <form onSubmit={handleSubmit} className="flex gap-6 mt-4 ml-4">
        <Textarea
          ref={textAreaRef}
          placeholder="Send your response paragraph..."
          name="message"
          className="w-[80%] mb-4 bg-white text-lg border border-blue-900 resize-none overflow-hidden"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onInput={handleInput}
          rows={1}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default ChatForm;
