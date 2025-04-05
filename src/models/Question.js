import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  image: { type: String, required: true },
  questionNumber: { type: Number, required: true },
  comments: [{
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to auto-increment questionNumber within the same group
questionSchema.pre('validate', async function (next) {
  if (this.isNew) {
    const lastQuestion = await mongoose.models.Question
      .findOne({ groupId: this.groupId })
      .sort({ questionNumber: -1 });

    this.questionNumber = lastQuestion ? lastQuestion.questionNumber + 1 : 1;
  }
  next();
});

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
