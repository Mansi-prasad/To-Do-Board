import React from "react";
import "./activityLog.css";

export default function ActivityLog({ activities }) {
  return (
    <div className="activity-log">
      <h3>Recent Activity</h3>
      <ul className="log-list">
        {activities && activities.length > 0 ? (
          activities.map((action, i) => (
            <li key={action._id || i} className="log-item">
              <span className="log-message">{action.message}</span>{" "}
              <span className="log-time">
                {new Date(action.timestamp).toLocaleString()}
              </span>
            </li>
          ))
        ) : (
          <li className="log-item">No recent activity.</li>
        )}
      </ul>
    </div>
  );
}
