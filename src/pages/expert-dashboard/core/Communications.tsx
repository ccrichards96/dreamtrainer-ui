import { useState, useEffect, useCallback } from "react";
import { Mail, MailOpen, ChevronLeft, ChevronRight, Inbox, MailCheck, MessageSquareReply } from "lucide-react";
import { getInbox, markAsRead, markAsReplied, InboxResponse } from "../../../services/api/messages";
import { Message } from "../../../types/modules";

const PAGE_SIZE = 15;

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function MessageListItem({
  message,
  isSelected,
  onClick,
}: {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { student, subject, body, isRead, createdAt } = message;
  const name = `${student.firstName} ${student.lastName}`;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-gray-100 flex gap-3 items-start transition-colors ${
        isSelected
          ? "bg-purple-50 border-l-2 border-l-purple-600"
          : "hover:bg-gray-50 border-l-2 border-l-transparent"
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0 w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold">
        {student.avatarUrl ? (
          <img src={student.avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          getInitials(student.firstName, student.lastName)
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm truncate ${!isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
            {name}
          </span>
          <span className="text-xs text-gray-400 shrink-0">{formatDate(createdAt)}</span>
        </div>
        <div className={`text-sm truncate mt-0.5 ${!isRead ? "font-medium text-gray-800" : "text-gray-600"}`}>
          {subject}
        </div>
        <div className="text-xs text-gray-400 truncate mt-0.5">{body}</div>
      </div>

      {!isRead && (
        <div className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-purple-600" />
      )}
    </button>
  );
}

function MessageDetail({
  message,
  onMarkRead,
  onMarkReplied,
}: {
  message: Message;
  onMarkRead: () => void;
  onMarkReplied: () => void;
}) {
  const { student, subject, body, isRead, isReplied, createdAt } = message;
  const name = `${student.firstName} ${student.lastName}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{subject}</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold shrink-0">
            {student.avatarUrl ? (
              <img src={student.avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(student.firstName, student.lastName)
            )}
          </div>
          <span className="text-sm text-gray-600">{name}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</span>
          {isReplied && (
            <span className="ml-auto text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
              Replied
            </span>
          )}
          {!isRead && (
            <span className="ml-auto text-xs text-purple-600 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">
              Unread
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-5 overflow-y-auto">
        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{body}</p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
        <button
          onClick={onMarkRead}
          disabled={isRead}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <MailCheck className="w-4 h-4" />
          {isRead ? "Read" : "Mark as Read"}
        </button>
        <button
          onClick={onMarkReplied}
          disabled={isReplied}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <MessageSquareReply className="w-4 h-4" />
          {isReplied ? "Replied" : "Mark as Replied"}
        </button>
      </div>
    </div>
  );
}

export default function Communications() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<InboxResponse["pagination"] | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchInbox = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getInbox({ page: p, limit: PAGE_SIZE });
      setMessages(result.messages);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInbox(page);
  }, [page, fetchInbox]);

  const updateMessageLocally = (id: string, patch: Partial<Message>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    setSelected((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  };

  const handleMarkRead = async () => {
    if (!selected || selected.isRead) return;
    await markAsRead(selected.id);
    updateMessageLocally(selected.id, { isRead: true, readAt: new Date().toISOString() });
  };

  const handleMarkReplied = async () => {
    if (!selected || selected.isReplied) return;
    await markAsReplied(selected.id);
    updateMessageLocally(selected.id, { isReplied: true, repliedAt: new Date().toISOString() });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Communications</h1>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ height: "calc(100vh - 220px)", minHeight: 400 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm">Loading messages...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 text-sm">{error}</div>
        ) : (
          <div className="flex h-full">
            {/* Message list */}
            <div className="w-80 shrink-0 flex flex-col border-r border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4" />
                  Inbox
                  {pagination && (
                    <span className="text-xs text-gray-400 font-normal">({pagination.total})</span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 py-12">
                    <Inbox className="w-8 h-8" />
                    <p className="text-sm">No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <MessageListItem
                      key={msg.id}
                      message={msg}
                      isSelected={selected?.id === msg.id}
                      onClick={() => setSelected(msg)}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="text-xs text-gray-500">
                    {page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Detail panel */}
            <div className="flex-1 overflow-hidden">
              {selected ? (
                <MessageDetail
                  message={selected}
                  onMarkRead={handleMarkRead}
                  onMarkReplied={handleMarkReplied}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <MailOpen className="w-10 h-10" />
                  <p className="text-sm">Select a message to read</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
