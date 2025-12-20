# Tool Instructions Data

This directory will contain "How to Use" instructions for brewing tools separated from React components.

## Current Status
Tool instructions are currently in: `/components/brewing/BrewingInstructions.tsx`

## Future Structure
```
instructions/
└── tool-instructions.ts  # All 12 tool instruction sets
```

## Migration Plan (Batch 12+)
1. Extract instruction data from React component
2. Create TypeScript data file with type safety
3. Update BrewingInstructions component to import from data file
4. Expand instructions with more detail
5. Add screenshots/diagrams references
6. Include troubleshooting sections
