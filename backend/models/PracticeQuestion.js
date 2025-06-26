            // physics-olympiad-website/backend/models/PracticeQuestion.js
            const mongoose = require('mongoose');

            const practiceQuestionSchema = mongoose.Schema(
              {
                topic: { // This field links a question to a specific topic
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'PracticeTopic',
                  required: true,
                },
                questionText: {
                  type: String,
                  required: true,
                },
                options: [
                  {
                    type: String,
                    required: true,
                  },
                ],
                correctAnswer: {
                  type: String,
                  required: true,
                },
                explanation: {
                  type: String,
                },
                author: { // Assuming a user model
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
                },
              },
              {
                timestamps: true,
              }
            );

            const PracticeQuestion = mongoose.model('PracticeQuestion', practiceQuestionSchema);

            module.exports = PracticeQuestion;
            
