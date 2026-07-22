import { SectionLabel } from "./sectionLabel";
import { GoalProgress } from "./goalProgress";

export function GoalsSection({ goals }) {
  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <SectionLabel>Goals & Targets</SectionLabel>

      {goals.map((goal) => (
        <GoalProgress key={goal.label} {...goal} />
      ))}
    </div>
  );
}
