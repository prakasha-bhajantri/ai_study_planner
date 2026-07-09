study_goals = [
    {
        "subject": "Mathematics",
        "total_hours": 10,
        "difficulty": "Hard",
        "preferred_slot": "Morning",
        "deadline": "2026-07-15"
    },
    {
        "subject": "Physics",
        "total_hours": 8,
        "difficulty": "Medium",
        "preferred_slot": "Evening",
        "deadline": "2026-07-18"
    }
]

tasks = [
    {
        "id": 1,
        "day": 1,
        "subject": "Mathematics",
        "hours": 2,
        "difficulty": "Hard",
        "preferred_slot": "Morning",
        "status": "completed",
        "deadline": "2026-07-15"
    },
    {
        "id": 2,
        "day": 2,
        "subject": "Mathematics",
        "hours": 2,
        "difficulty": "Hard",
        "preferred_slot": "Morning",
        "status": "pending",
        "deadline": "2026-07-15"
    },
    {
        "id": 3,
        "day": 1,
        "subject": "Physics",
        "hours": 2,
        "difficulty": "Medium",
        "preferred_slot": "Evening",
        "status": "pending",
        "deadline": "2026-07-18"
    }
]

# from backend.storage import study_goals, tasks


def build_context():

    context = []

    context.append("=" * 60)
    context.append("STUDENT OVERVIEW")
    context.append("=" * 60)

    total_subjects = len(study_goals)

    completed = len([
        t for t in tasks
        if t["status"] == "completed"
    ])

    pending = len([
        t for t in tasks
        if t["status"] == "pending"
    ])

    planned_hours = sum(
        goal["total_hours"]
        for goal in study_goals
    )

    completed_hours = sum(
        task["hours"]
        for task in tasks
        if task["status"] == "completed"
    )

    context.append(f"Total Subjects : {total_subjects}")
    context.append(f"Planned Hours  : {planned_hours}")
    context.append(f"Completed Hours: {completed_hours}")
    context.append(f"Completed Tasks: {completed}")
    context.append(f"Pending Tasks  : {pending}")

    context.append("")
    context.append("=" * 60)
    context.append("CURRENT TASKS")
    context.append("=" * 60)

    if not tasks:

        context.append("No study tasks available.")

    else:

        for i, task in enumerate(tasks, start=1):

            context.append(f"""
Task {i}

Subject        : {task["subject"]}
Status         : {task["status"]}
Difficulty     : {task["difficulty"]}
Duration       : {task["hours"]} hour(s)
Preferred Slot : {task["preferred_slot"]}
Deadline       : {task["deadline"]}
""")

    return "\n".join(context)


context = build_context()

print(context)