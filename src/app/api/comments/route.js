import Question from '@/models/Question';
import dbConnect from '@/lib/dbConnect';

export async function POST(request) {
  await dbConnect();
  const { questionId, text } = await request.json();
  console.log(questionId, text);
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return Response.json({ error: 'Question not found' }, { status: 404 });
    }

    question.comments.push({ text });
    await question.save();

    return Response.json(question, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}