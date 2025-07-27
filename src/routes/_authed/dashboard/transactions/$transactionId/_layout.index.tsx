import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import {
  TransactionForm,
  transactionFormSchema,
} from "@/components/transaction-form";
import { getCategories } from "@/data/getCategories";
import { getTransaction } from "@/data/getTransaction";
import z from "zod";
import { updateTransaction } from "@/data/updateTransaction";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { deleteTransaction } from "@/data/deleteTransaction";
export const Route = createFileRoute(
  "/_authed/dashboard/transactions/$transactionId/_layout/"
)({
  component: RouteComponent,
  errorComponent: ({ error }) => {
    return (
      <div className="text-3xl mt-8 text-muted-foreground">
        Oops! {error.message}
      </div>
    );
  },
  loader: async ({ params }) => {
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({
        data: {
          transactionId: Number(params.transactionId),
        },
      }),
    ]);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return {
      transaction,
      categories,
    };
  },
});

function RouteComponent() {
  const [deleting, setDeleting] = useState(false);
  const { categories, transaction } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await updateTransaction({
      data: {
        id: transaction.id,
        amount: data.amount,
        transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
        categoryId: data.categoryId,
        description: data.description,
      },
    });

    toast("Success!", {
      description: "Transaction updated",
      className: "bg-green-500 text-white",
    });

    navigate({
      to: "/dashboard/transactions",
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await deleteTransaction({
      data: {
        transactionId: transaction.id,
      },
    });

    toast("Success!", {
      description: "Transaction deleted",
      className: "bg-green-500 text-white",
    });

    setDeleting(false);

    navigate({
      to: "/dashboard/transactions",
      search: {
        month: Number(transaction.transactionDate.split("-")[1]), //getting month and year from the date string yyyy-mm-dd
        year: Number(transaction.transactionDate.split("-")[0]),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Edit Transaction</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This transaction will be
                  permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
                  variant="destructive"
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm
          categories={categories}
          onSubmit={handleSubmit}
          defaultValues={{
            amount: Number(transaction.amount),
            categoryId: transaction.categoryId,
            description: transaction.description,
            transactionDate: new Date(transaction.transactionDate),
            transactionType:
              categories.find(
                (category) => category.id === transaction.categoryId
              )?.type ?? "income",
          }}
        />
      </CardContent>
    </Card>
  );
}
