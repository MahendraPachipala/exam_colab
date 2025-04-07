import Question from '@/models/Question';
import dbConnect from '@/lib/dbConnect';

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;
  

  try {
    const question = await Question.findById(id);
    if (!question) {
      return Response.json({ error: 'Question not found' }, { status: 404 });
    }
    return Response.json(question);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch question' }, { status: 500 });
  }
}
