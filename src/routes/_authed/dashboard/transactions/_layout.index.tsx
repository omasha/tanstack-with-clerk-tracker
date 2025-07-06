import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const today = new Date();

const searchSchema = z.object({
  month: z
    .number()
    .min(1)
    .max(12)
    .catch(today.getMonth() + 1) //provides default value if input is invalid or missing
    .optional(),
  year: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
});

export const Route = createFileRoute(
  "/_authed/dashboard/transactions/_layout/"
)({
  component: RouteComponent,
  validateSearch: searchSchema, // needed for creating pages with month and year in their url
});

function RouteComponent() {
  return <div>Hello "/_authed/dashboard/transactions/"!</div>;
}
