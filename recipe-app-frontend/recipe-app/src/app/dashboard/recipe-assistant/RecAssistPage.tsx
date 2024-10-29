"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ConversationSidebar } from "@/app/dashboard/compliance-assistant/components/SideBar";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import { useConversations } from "./components/hooks";
import { Conversation } from "./components/types";

export function AgentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isSidebarOpen");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const databases: Database[] = useDatabases();
  const [conversations, setConversations] = useConversations();

  const updateURL = useCallback(
    (conversationId: string | null, databaseId: string | null) => {
      const params = new URLSearchParams();
      if (conversationId) params.set("conversationId", conversationId);
      if (databaseId) params.set("databaseId", databaseId);
      router.push(`/dashboard/compliance-assistant?${params.toString()}`, {
        scroll: false,
      });
    },
    [router],
  );

  useEffect(() => {
    localStorage.setItem("isSidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    // Change this to only check if the data has been fetched, not if it has content
    if (databases !== undefined && conversations !== undefined) {
      setIsInitialLoading(false);
    }
  }, [databases, conversations]);

  useEffect(() => {
    if (
      !isInitialLoading &&
      databases.length > 0 &&
      selectedConversationId === null
    ) {
      const urlConversationId = searchParams.get("conversationId");
      const urlDatabaseId = searchParams.get("databaseId");
      const storedConversationId = localStorage.getItem(
        "lastSelectedConversationId",
      );
      const storedDatabaseId = localStorage.getItem("lastSelectedDatabaseId");

      let conversationToSelect =
        urlConversationId ||
        storedConversationId ||
        (conversations.length > 0 ? conversations[0].id : null);

      if (
        conversationToSelect &&
        !conversations.some((conv) => conv.id === conversationToSelect)
      ) {
        conversationToSelect =
          conversations.length > 0 ? conversations[0].id : null;
      }

      if (conversationToSelect) {
        setSelectedConversationId(conversationToSelect);
        localStorage.setItem(
          "lastSelectedConversationId",
          conversationToSelect,
        );
      } else {
        setSelectedConversationId(null);
        localStorage.removeItem("lastSelectedConversationId");
      }

      const databaseToSelect =
        urlDatabaseId ||
        storedDatabaseId ||
        (databases.length > 0 ? databases[0].id : null);

      if (
        databaseToSelect &&
        databases.some((db) => db.id === databaseToSelect)
      ) {
        setSelectedDatabase(databaseToSelect);
      }

      updateURL(conversationToSelect, databaseToSelect);
    }
  }, [
    isInitialLoading,
    databases,
    conversations,
    selectedConversationId,
    searchParams,
    updateURL,
  ]);

  useEffect(() => {
    if (selectedConversationId && conversations.length > 0) {
      const selectedConv = conversations.find(
        (conv) => conv.id === selectedConversationId,
      );
      setSelectedConversation(selectedConv || null);
    } else {
      setSelectedConversation(null);
    }
  }, [selectedConversationId, conversations]);

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    localStorage.setItem("lastSelectedConversationId", conversationId);
    updateURL(conversationId, selectedDatabase);
  };

  const handleDatabaseChange = (databaseId: string) => {
    setSelectedDatabase(databaseId);
    localStorage.setItem("lastSelectedDatabaseId", databaseId);
    updateURL(selectedConversationId, databaseId);
  };

  const handleNewConversation = useCallback(async () => {
    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Conversation ${conversations.length + 1}`,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create new conversation");
      }
      const newConversation: Conversation = await response.json();
      setConversations((prevConversations) => [
        newConversation,
        ...prevConversations,
      ]);

      setSelectedConversationId(newConversation.id);
      localStorage.setItem("lastSelectedConversationId", newConversation.id);
      updateURL(newConversation.id, selectedDatabase);
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  }, [conversations.length, selectedDatabase, setConversations, updateURL]);

  const updateConversationTitle = async (
    conversationId: string,
    newTitle: string,
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/conversation/${conversationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) {
        throw new Error("Failed to update conversation title");
      }

      const updatedConversation: Conversation = await response.json();

      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === updatedConversation.id ? updatedConversation : conv,
        ),
      );

      setSelectedConversation(updatedConversation);
    } catch (error) {
      console.error("Error updating conversation title:", error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversation/${conversationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete conversation");
      }

      setConversations((prevConversations) =>
        prevConversations.filter((conv) => conv.id !== conversationId),
      );

      if (selectedConversationId === conversationId) {
        localStorage.removeItem("lastSelectedConversationId");
        setSelectedConversationId(null);
        setSelectedConversation(null);
        updateURL(null, selectedDatabase);
      }

      console.log("Conversation deleted successfully");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("Failed to delete conversation. Please try again.");
    }
  };

  return (
    <div className="flex">
      <ConversationSidebar
        isOpen={isSidebarOpen}
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        selectedConversation={selectedConversation}
      />
      <motion.div
        className="flex-1"
        initial={false}
        animate={{ marginLeft: isSidebarOpen ? "20rem" : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex-col md:flex">
          <div className="flex-1 space-y-4 p-8 pt-4">
            <Header
              isSidebarOpen={isSidebarOpen}
              handleToggleSidebar={handleToggleSidebar}
              selectedConversation={selectedConversation}
              databases={databases}
              selectedDatabase={selectedDatabase}
              handleDatabaseChange={handleDatabaseChange}
              isInitialLoading={isInitialLoading}
            />
            <div className="flex pt-1 space-x-2">
              <MainContent
                isInitialLoading={isInitialLoading}
                conversations={conversations}
                selectedDatabase={selectedDatabase}
                selectedConversation={selectedConversation}
                updateConversationTitle={updateConversationTitle}
                handleNewConversation={handleNewConversation}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
