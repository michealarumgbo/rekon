import mongoose, { Schema } from "mongoose";

const faceschema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    embeddings: { type: [Number], default: [] }, //store image embedding
  },
  { timestamps: true }
);
const Face = mongoose.model("Face", faceschema);

export default Face;
