import Group from '@/models/Group';
import dbConnect from '@/lib/dbConnect';

export async function POST() {
  await dbConnect();
  
  try {
    const group = new Group();
    await group.save();
    
    return Response.json({ code: group.code }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create group' }, { status: 500 });
  }
}