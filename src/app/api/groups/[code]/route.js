import Group from '@/models/Group';
import Question from '@/models/Question';
import dbConnect from '@/lib/dbConnect';

export async function GET(request, { params }) {
  await dbConnect();
 
  const { code } = await params;

  try {
    const group = await Group.findOne({ code });
    if (!group) {
      return Response.json({ error: 'Group not found' }, { status: 404 });
    }

    const questions = await Question.find({ groupId: group._id }).sort({ createdAt: -1 });
    return Response.json({ group, questions });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch group data' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  await dbConnect();
  const { code } =await  params;
  const { image } = await request.json();

  try {
    const group = await Group.findOne({ code });
    if (!group) {
      return Response.json({ error: 'Group not found' }, { status: 404 });
    }

    const question = new Question({
      groupId: group._id,
      image,
    });
    await question.save();

    return Response.json(question, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to add question' }, { status: 500 });
  }
}