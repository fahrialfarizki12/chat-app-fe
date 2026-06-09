"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { MessageInterface } from "@/interface/message.in";
import axiosInstance from "@/lib/Axios";
import shortName from "@/lib/shortName";
import { formatTime } from "@/lib/shortTime";
import { socket } from "@/lib/socket/socket";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Users {
  id: string;
  username: string;
}

export default function ChatUI() {
  const [dataMessage, setDataMessage] = useState<MessageInterface[]>([]);
  const [getUsers, setDataUsers] = useState<Users | null>(null);

  //feth data
  const getDataMessage = async () => {
    try {
      const result = await axiosInstance.get("/chat");
      setDataMessage(result.data.data);
      console.log(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataMessage();
  }, []);

  useEffect(() => {
    const storageItem = localStorage.getItem("users");
    if (storageItem) {
      const parsed = JSON.parse(storageItem);
      setDataUsers(parsed.data);
    }
  }, []);

  useEffect(() => {
    console.log("users updated:", getUsers);
  }, [getUsers]);

  useEffect(() => {
    const onConnect = () => {
      console.log("connected:", socket.id);
    };

    const onMessage = (data: any) => {
      setDataMessage((prev) => [...prev, data]);
    };

    socket.on("connect", onConnect);
    socket.on("message", onMessage);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("message", onMessage);
      socket.disconnect();
    };
  }, []);
  // useForm
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const submitForm = async (data: any) => {
    try {
      const result = await axiosInstance.post("/chat", data);

      reset();
      toast.success("Successfully Send Message");
    } catch (error) {
      toast.success("Failled Send Message");
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 h-16 bg-primary text-secondary shadow">
        <nav className="max-w-4xl mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>FS</AvatarFallback>
            </Avatar>

            <div>
              <h2 className="font-semibold">Chat Group</h2>
              <p className="text-xs opacity-70">Room 01</p>
            </div>
          </div>
        </nav>
      </header>

      {/* Chat Area */}
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-36">
        {/* Chat Orang Lain */}
        {dataMessage.map((item, index) => {
          const isMe = item.sender.id === getUsers?.id;

          return (
            <div
              key={index}
              className={`flex mb-4 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {/* OTHER USER */}
              {!isMe && (
                <div className="flex items-end gap-2">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-secondary">
                      {shortName(item.sender.username)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className=" rounded-2xl bg-white p-3 shadow">
                      <p>{item.content}</p>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(item.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* ME */}
              {isMe && (
                <div className="flex items-end gap-2 flex-row-reverse">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-secondary">
                      {shortName(item.sender.username)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col items-end">
                    <div className="max-w-[75%] rounded-2xl bg-primary text-secondary p-3 shadow">
                      <p>{item.content}</p>
                    </div>

                    <p className="text-xs text-secondary/70 mt-1">
                      {formatTime(item.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {/* Chat Sendiri */}
      </main>

      {/* Input Chat */}
      <footer className="fixed bottom-0 left-0 right-0 bg-primary border-t shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-2">
            <form className="w-full" onSubmit={handleSubmit(submitForm)}>
              <Textarea
                {...register("content")}
                placeholder="Ketik pesan..."
                className="bg-secondary overflow-y-scroll h-20 resize-none"
              />
              <Button className="bg-secondary w-full mt-2 text-primary cursor-pointer">
                Send
              </Button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}
