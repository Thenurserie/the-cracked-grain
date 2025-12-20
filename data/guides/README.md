# Brewing Guides Data

This directory will contain brewing guide content separated from React components.

## Current Status
Guide content is currently in: `/components/brewing/Guides.tsx`

## Future Structure
```
guides/
├── starter-kit.ts       # 3 guides for beginners
├── brewing-basics.ts    # 5 foundational guides
├── all-grain.ts         # 6 advanced all-grain guides
├── fermentation.ts      # 6 fermentation guides
└── packaging.ts         # 5 packaging guides
```

## Migration Plan (Batch 12+)
1. Extract guide data from React component
2. Create TypeScript data files with type safety
3. Update Guides component to import from data files
4. Expand content for each guide
5. Add new guides as needed
