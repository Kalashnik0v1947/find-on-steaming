const { Schema, model, Types } = require("mongoose");


const tweetSchema = new Schema(
  {
     content: {
      type: String,
      required: true,
    },
     gif: {
      type: String,
          },
    creatorId: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {

    timestamps: true,
  }
);

const Tweet = model("Tweet", tweetSchema);

module.exports = Tweet;
