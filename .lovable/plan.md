## Goal

Let users mark **Funding Goal** as **N/A** when they don't have a fixed target (open to any amount, take whatever they can get). This should feel like a clean one-tap toggle, not a free-text workaround.

## UX

In the Generator form, next to the "Funding goal" label, add a small **N/A** pill toggle:

- **Off (default):** the input is editable, placeholder updated to `"€10,000 or N/A"`.
- **On:** the input is locked to the value `"N/A"`, visually disabled, placeholder shows `"Open to any amount"`. Pill turns into the brand gradient with white text so it's obvious it's active.

Tapping the pill again clears the field back to empty so the user can type a number.

```text
[Coins] Funding goal                    [ N/A ]
[ €10,000 or N/A ____________________________ ]
```

## Downstream behavior

The value `"N/A"` flows through naturally:

- **Bob The Builder** already passes `fundingGoal` as user context — when it's `"N/A"`, Bob will see the user is flexible on funding and can suggest a range of grants.
- **Expand with AI** edge function lists the funding goal as `"(not provided)"` only when empty; when `"N/A"` it will be shown as `N/A`, which is fine — the model will treat it as "no fixed target."
- **generatePlan** uses `fundingGoal` as a string in the generated grant draft. The `"N/A"` value will appear in the output as-is, which reads naturally ("Funding goal: N/A").

No changes needed to the edge functions, Bob, or the plan generator — only the Generator form.

## Files to change

- `src/components/grantflow/Generator.tsx` — wrap the Funding goal label + pill in a flex row, add the toggle button, disable the input and swap placeholder when `form.fundingGoal === "N/A"`.

No new dependencies, no backend changes.
