import GroupPageContent from './GroupPageContent';
import dbConnect from '@/lib/dbConnect';
import Group from '@/models/Group';

async function getGroupData(code) {
  
  await dbConnect();
  const group = await Group.findOne({ code });
  
  if (!group) {
    return null;
  }

  return JSON.parse(JSON.stringify(group));
}

export default async function GroupPage({ params }) {
  const { code } = await params;
  const group = await getGroupData(code);
  
  if (!group) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Group not found</h1>
          <p className="mt-2 text-gray-600">The group code you entered is invalid or has expired</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return <GroupPageContent groupId={group._id} groupCode={group.code} />;
}