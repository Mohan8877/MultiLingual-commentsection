import type { Comment } from "./models/comment"

// Server-side socket emitter for API routes
class SocketEmitter {
  private static instance: SocketEmitter
  private io: any = null

  private constructor() {}

  static getInstance(): SocketEmitter {
    if (!SocketEmitter.instance) {
      SocketEmitter.instance = new SocketEmitter()
    }
    return SocketEmitter.instance
  }

  setIO(io: any) {
    this.io = io
  }

  emitNewComment(comment: Comment) {
    if (this.io) {
      this.io.to("comments-room").emit("comment:new", comment)
    }
  }

  emitCommentUpdated(comment: Comment) {
    if (this.io) {
      this.io.to("comments-room").emit("comment:updated", comment)
    }
  }

  emitCommentDeleted(commentId: string) {
    if (this.io) {
      this.io.to("comments-room").emit("comment:deleted", commentId)
    }
  }
}

export const socketEmitter = SocketEmitter.getInstance()
