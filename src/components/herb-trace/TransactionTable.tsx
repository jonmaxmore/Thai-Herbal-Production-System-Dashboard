
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { MarketplaceTransaction } from "@/utils/marketplaceData";
import { Badge } from "@/components/ui/badge";

interface TransactionTableProps {
  transactions: MarketplaceTransaction[];
}

// Helper function to get badge color based on transaction status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return "bg-green-500";
    case 'Pending':
      return "bg-yellow-500";
    case 'Processing':
      return "bg-blue-500";
    case 'Failed':
      return "bg-red-500";
    case 'Refunded':
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Recent Marketplace Transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.userId}</TableCell>
                  <TableCell>
                    {transaction.productName} × {transaction.quantity}
                  </TableCell>
                  <TableCell>
                    {transaction.timestamp.toLocaleDateString('en-TH')}
                  </TableCell>
                  <TableCell>฿{transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
