---
name: edit-article
description: Edit prose for clarity, structure, argument flow, concision, and reader impact. Use when the user provides an article, draft, essay, post, or long-form writing to improve.
category: tooling
tags:
  - writing
  - editing
  - article
  - prose
target_llms:
  - chatgpt
  - claude-code
composable_with: []
---

# Edit Article

Use this skill to improve a piece of writing while preserving the author’s intent and voice.

## When to Use

Use when the user provides prose and asks to:
- edit;
- tighten;
- restructure;
- improve flow;
- make it clearer;
- make it more persuasive;
- prepare it for publication.

## Process

1. Identify the intended audience and purpose from the draft.
2. Preserve the core argument and voice unless the user asks otherwise.
3. Improve structure before sentence-level polish.
4. Remove repetition, filler, and unclear transitions.
5. Strengthen openings, section flow, and conclusions.
6. Flag claims that need evidence rather than silently inventing support.
7. Provide either a revised draft or targeted edits depending on the user’s request.

## Output Contract

When revising, provide:
- a cleaned-up version;
- a short list of major changes;
- optional notes for claims, structure, or tone.

When reviewing, provide:
- structural feedback;
- line-level issues;
- suggested rewrites for weak passages.

## Verification

The edited article should be clearer, tighter, and easier to follow without changing the author’s meaning.

## What NOT to Do

- Do not fabricate citations or facts.
- Do not erase the author’s voice.
- Do not over-polish into generic corporate prose.
- Do not make major argument changes without saying so.
