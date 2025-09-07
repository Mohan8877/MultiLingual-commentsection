import { getDatabase } from "./mongodb"
import { type Comment, type Translation, validateComment, validateUsername } from "./models/comment"
import { ObjectId } from "mongodb"

export class DatabaseOperations {
  private async getCommentsCollection() {
    const db = await getDatabase()
    return db.collection<Comment>("comments")
  }

  private async getTranslationsCollection() {
    const db = await getDatabase()
    return db.collection<Translation>("translations")
  }

  async createComment(commentData: Omit<Comment, "_id" | "createdAt" | "updatedAt">): Promise<Comment> {
    if (!validateComment(commentData.content)) {
      throw new Error("Invalid comment content")
    }
    if (!validateUsername(commentData.username)) {
      throw new Error("Invalid username")
    }

    const collection = await this.getCommentsCollection()
    const now = new Date()

    const comment: Omit<Comment, "_id"> = {
      ...commentData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await collection.insertOne(comment)
    return { ...comment, _id: result.insertedId }
  }

  async getComments(limit = 50, skip = 0): Promise<Comment[]> {
    const collection = await this.getCommentsCollection()
    return await collection.find({}).sort({ createdAt: -1 }).limit(limit).skip(skip).toArray()
  }

  async likeComment(commentId: string, userIp: string): Promise<Comment | null> {
    const collection = await this.getCommentsCollection()
    const objectId = new ObjectId(commentId)

    // Remove from dislikes if present, add to likes
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      {
        $pull: { dislikedBy: userIp },
        $addToSet: { likedBy: userIp },
        $inc: { likes: 1 },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" },
    )

    // If user was in dislikedBy, decrement dislikes
    if (result && result.dislikedBy?.includes(userIp)) {
      await collection.updateOne({ _id: objectId }, { $inc: { dislikes: -1 } })
    }

    return result
  }

  async dislikeComment(commentId: string, userIp: string): Promise<Comment | null> {
    const collection = await this.getCommentsCollection()
    const objectId = new ObjectId(commentId)

    // Remove from likes if present, add to dislikes
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      {
        $pull: { likedBy: userIp },
        $addToSet: { dislikedBy: userIp },
        $inc: { dislikes: 1 },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" },
    )

    // If user was in likedBy, decrement likes
    if (result && result.likedBy?.includes(userIp)) {
      await collection.updateOne({ _id: objectId }, { $inc: { likes: -1 } })
    }

    // Check if comment should be auto-deleted (2 or more dislikes)
    if (result && result.dislikes >= 2) {
      await this.deleteComment(commentId)
      return null // Comment was deleted
    }

    return result
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const collection = await this.getCommentsCollection()
    const translationsCollection = await this.getTranslationsCollection()
    const objectId = new ObjectId(commentId)

    // Delete associated translations
    await translationsCollection.deleteMany({ commentId: objectId })

    // Delete the comment
    const result = await collection.deleteOne({ _id: objectId })
    return result.deletedCount > 0
  }

  async saveTranslation(translation: Omit<Translation, "_id" | "createdAt">): Promise<Translation> {
    const collection = await this.getTranslationsCollection()
    const translationData: Omit<Translation, "_id"> = {
      ...translation,
      createdAt: new Date(),
    }

    const result = await collection.insertOne(translationData)
    return { ...translationData, _id: result.insertedId }
  }

  async getTranslation(commentId: string, targetLanguage: string): Promise<Translation | null> {
    const collection = await this.getTranslationsCollection()
    return await collection.findOne({
      commentId: new ObjectId(commentId),
      targetLanguage,
    })
  }
}

export const dbOps = new DatabaseOperations()
