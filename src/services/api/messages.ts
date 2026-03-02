import apiClient from "./client";
import { APIResponseWithPagination } from "../../types/api";
import { Message } from "../../types/modules";

export interface InboxParams {
  page?: number;
  limit?: number;
}

export interface InboxResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const markAsRead = async (id: string): Promise<void> => {
  try {
    await apiClient.patch(`/messages/${id}/read`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to mark message as read");
  }
};

export const markAsReplied = async (id: string): Promise<void> => {
  try {
    await apiClient.patch(`/messages/${id}/replied`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to mark message as replied");
  }
};

export const getInbox = async (params: InboxParams = {}): Promise<InboxResponse> => {
  try {
    const response = await apiClient.get<APIResponseWithPagination<Message[]>>("/messages/inbox", {
      params,
    });
    return {
      messages: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch inbox");
  }
};
