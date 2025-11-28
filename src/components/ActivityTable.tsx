import React from "react";

interface Activity {
  id: number;
  activity: string;
  date: string;
}

interface ActivityTableProps {
  activities: Activity[];
}

const ActivityTable: React.FC<ActivityTableProps> = ({ activities }) => {
  return (
    <table className="activity-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Activity</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((act) => (
          <tr key={act.id}>
            <td>{act.id}</td>
            <td>{act.activity}</td>
            <td>{act.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ActivityTable;
