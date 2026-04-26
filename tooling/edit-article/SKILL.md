---
name: edit-article
description: >
  Edit and improve articles by restructuring sections, improving clarity, and tightening prose. Triggers: 'edit this article', 'improve this post', 'tighten this prose'. Do NOT trigger for code reviews.
category: tooling
tags: [writing, editing, prose, articles, clarity]
target_llms: [all]
source: mattpocock/skills
composable_with:
  - tooling/ubiquitous-language
---

1. First, divide the article into sections based on its headings. Think about the main points you want to make during those sections.

Consider that information is a directed acyclic graph, and that pieces of information can depend on other pieces of information. Make sure that the order of the sections and their contents respects these dependencies.

Confirm the sections with the user.

2. For each section:

2a. Rewrite the section to improve clarity, coherence, and flow. Use maximum 240 characters per paragraph.
