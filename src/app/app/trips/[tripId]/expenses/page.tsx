import ExpenseShell from "@/components/expenses/ExpenseShell";

export default async function ExpensesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  await params;
  return <ExpenseShell />;
}
