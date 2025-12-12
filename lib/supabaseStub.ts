// Temporary stub for Supabase to allow brewing components to compile
// These components use local state only until properly migrated to Prisma

// Helper to create chainable query builder
const createChainableQuery = () => {
  const chain: any = {
    select: (columns?: string) => chain,
    order: (column: string, options?: any) => chain,
    eq: (column: string, value: any) => chain,
    single: () => chain,
    then: (resolve: any) => resolve({ data: null, error: null }),
    catch: (reject: any) => Promise.resolve({ data: null, error: null }),
  };
  return chain;
};

const supabaseStub = {
  from: (table: string) => ({
    select: (columns?: string) => createChainableQuery(),
    insert: (data: any) => createChainableQuery(),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
  }),
};

// Make supabase available globally for brewing components
if (typeof window !== 'undefined') {
  (window as any).supabase = supabaseStub;
}

export const supabase = supabaseStub;
