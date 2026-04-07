import AssignmentCard from "./AssignmentCard";

const AssignmentColumn = ({ assignments }) => {
  if (assignments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No assignments in this category
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assignments.map((a) => (
        <AssignmentCard key={a.id} assignment={a} />
      ))}
    </div>
  );
};

export default AssignmentColumn;
