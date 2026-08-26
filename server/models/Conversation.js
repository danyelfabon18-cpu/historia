import mongoose from "mongoose";

const conversationMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["visitor", "admin"],
      required: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

const conversationSchema = new mongoose.Schema(
  {
    visitorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    visitorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    /*
      We never save the visitor's raw private token.
      Only the SHA-256 hash is stored in MongoDB.
    */
    visitorTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    adminUnreadCount: {
      type: Number,
      default: 1,
      min: 0,
    },

    visitorUnreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    messages: {
      type: [conversationMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
