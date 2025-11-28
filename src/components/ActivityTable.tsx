import React from "react";

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  created_at: string;
}

interface Props {
  activities?: ActivityItem[]; // <-- optional, safe
}

const ActivityTable: React.FC<Props> = ({ activities = [] }) => {
  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      {activities.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No recent activity.
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-3 rounded-lg border border-border/50 bg-card/50"
            >
              <p className="font-medium">{activity.type}</p>
              <p className="text-sm text-muted-foreground">
                {activity.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTable;
