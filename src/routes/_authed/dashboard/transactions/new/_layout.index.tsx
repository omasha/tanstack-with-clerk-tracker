import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TransactionForm,
  transactionFormSchema,
} from "@/components/transaction-form";
import { getCategories } from "@/data/getCategories";
import z from "zod";
import { createTransaction } from "@/data/createTransaction";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/_authed/dashboard/transactions/new/_layout/"
)({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories();
    return {
      categories,
    };
  },
});

function RouteComponent() {
  const { categories } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    console.log("HANDLE SUBMIT: ", { data });
    const transaction = await createTransaction({
      data: {
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description,
        transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
      },
    });
    console.log({ transaction });

    toast("Success!", {
      className: "bg-green-500 text-white",
      description: "Transaction created",
    });

    navigate({
      to: "/dashboard/transactions",
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
