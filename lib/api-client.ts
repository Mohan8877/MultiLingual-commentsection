import axios from "axios"
import type { Comment } from "./models/comment"

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
})

export class ApiClient {
  async getComments(limit = 50, skip = 0): Promise<Comment[]> {
    const response = await api.get(`/comments?limit=${limit}&skip=${skip}`)
    return response.data.data
  }

  async createComment(username: string, content: string): Promise<Comment> {
    const response = await api.post("/comments", { username, content })
    return response.data.data
  }

  async likeComment(commentId: string): Promise<Comment> {
    const response = await api.post(`/comments/${commentId}/like`)
    return response.data.data
  }

  async dislikeComment(commentId: string): Promise<Comment | null> {
    const response = await api.post(`/comments/${commentId}/dislike`)

    if (response.data.deleted) {
      return null // Comment was deleted
    }

    return response.data.data
  }

  async translateComment(
    commentId: string,
    text: string,
    targetLanguage: string,
    sourceLanguage = "auto",
  ): Promise<{ translatedText: string; cached: boolean }> {
    const response = await api.post("/translate", {
      commentId,
      text,
      targetLanguage,
      sourceLanguage,
    })
    return response.data.data
  }

  async healthCheck(): Promise<any> {
    const response = await api.get("/health")
    return response.data
  }
}

export const apiClient = new ApiClient()
