# Time-Wise

git pull origin main

| Insight                  | Backend Field Used                        | Logic                                                                      | Example Output                                                               |
| ------------------------ | ----------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 📈 **Attendance**        | `attendancePercentage`                    | If attendance ≥ 90% → positive, otherwise improvement message              | `Attendance rate is 41%. Try to improve consistency.`                        |
| ⏰ **Punctuality**       | `punctuality`                             | If punctuality ≥ 90% → excellent, otherwise improvement message            | `Outstanding punctuality at 100%.`                                           |
| 🎯 **Productivity**      | `productivity`                            | If productivity ≥ 80% → excellent, otherwise encourage improvement         | `Current productivity is 38%. Focus on improving task completion.`           |
| 💼 **Weekly Goal**       | `weeklyGoalScore`, `weeklyHoursRemaining` | If weekly goal completed → congratulations, otherwise show remaining hours | `40 hours remain to complete this week's goal.`                              |
| ☕ **Break Management**  | `breakScore`                              | If break score ≥ 90% → excellent, otherwise improvement message            | `Excellent break management with a score of 100%.`                           |
| 🔥 **Attendance Streak** | `dayStreak`, `longestStreak`              | Always show current streak and best streak                                 | `You're currently on a 5-day attendance streak. Your best streak is 5 days.` |
