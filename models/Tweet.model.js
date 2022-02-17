const { Schema, model, Types } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const tweetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creatorId: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Tweet = model("Tweet", tweetSchema);

module.exports = Tweet;
