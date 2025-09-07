-- MongoDB Index Creation Script
-- Run this to optimize query performance

-- Comments Collection Indexes
db.comments.createIndex({ "createdAt": -1 })
db.comments.createIndex({ "likes": -1 })
db.comments.createIndex({ "dislikes": 1 })
db.comments.createIndex({ "ipAddress": 1 })
db.comments.createIndex({ "city": 1 })

-- Translations Collection Indexes  
db.translations.createIndex({ "commentId": 1, "targetLanguage": 1 })
db.translations.createIndex({ "createdAt": -1 })

-- Compound indexes for common queries
db.comments.createIndex({ "createdAt": -1, "dislikes": 1 })
