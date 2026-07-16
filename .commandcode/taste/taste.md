# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# ui
- For login/register: use a choice-first flow (pick login or register, then show the form) with a back button, not tab-style switching. Confidence: 0.85

# architecture
- Never change the SaveData interface or save data structure — all save files (including old ones) must remain loadable after any patch. Confidence: 0.75

# git
- Commit without co-author attribution. Confidence: 0.70

# data
See [data/taste.md](data/taste.md)

# quests
- Before using a QuestEventKind in quest objectives, grep the codebase for `Bus.emit("quest-event"` to verify the event kind is actually emitted — use only events that exist in the system, never ones only defined in types. Confidence: 0.75
