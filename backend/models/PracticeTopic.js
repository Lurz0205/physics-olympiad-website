// physics-olympiad-website/backend/models/PracticeTopic.js
const mongoose = require('mongoose');

const practiceTopicSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, // Ensure topic titles are unique
    },
    slug: {
      type: String,
      required: true,
      unique: true, // Ensure slugs are unique for URL purposes
    },
    description: {
      type: String,
      required: true,
    },
    // You can add more fields here if needed, e.g., 'difficulty', 'image'
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const PracticeTopic = mongoose.model('PracticeTopic', practiceTopicSchema);

module.exports = PracticeTopic;
