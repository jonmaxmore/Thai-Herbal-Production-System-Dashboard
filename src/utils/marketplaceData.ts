
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Processing' | 'Refunded';

export interface MarketplaceTransaction {
  id: string;
  userId: string;
  timestamp: Date;
  amount: number;
  productName: string;
  quantity: number;
  status: TransactionStatus;
  paymentMethod: string;
}

const herbProducts = [
  'Turmeric Extract',
  'Ginger Root',
  'Peppermint Oil',
  'Lemongrass',
  'Thai Basil',
  'Holy Basil',
  'Galangal',
  'Kaffir Lime',
  'Butterfly Pea Flower',
  'Pandanus Leaf'
];

const paymentMethods = [
  'Credit Card',
  'Bank Transfer',
  'Cash on Delivery',
  'Mobile Payment',
  'Digital Wallet'
];

const statusOptions: TransactionStatus[] = [
  'Completed',
  'Pending',
  'Failed',
  'Processing',
  'Refunded'
];

// Generate a single transaction with random data
function generateTransaction(index: number): MarketplaceTransaction {
  const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const randomProduct = herbProducts[Math.floor(Math.random() * herbProducts.length)];
  const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
  const quantity = Math.floor(Math.random() * 10) + 1;
  const unitPrice = Math.floor(Math.random() * 500) + 50;
  
  // Generate a date within the last 30 days
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  
  return {
    id: `TRX-${String(index).padStart(6, '0')}`,
    userId: `USER-${Math.floor(Math.random() * 1000)}`,
    timestamp: date,
    amount: quantity * unitPrice,
    productName: randomProduct,
    quantity: quantity,
    status: randomStatus,
    paymentMethod: randomPayment
  };
}

// Generate an array of transactions
export function generateTransactions(count: number): MarketplaceTransaction[] {
  return Array(count).fill(null).map((_, index) => generateTransaction(index));
}

// Calculate transaction summaries
export function getTransactionTotals(transactions: MarketplaceTransaction[]) {
  const totalSales = transactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const pendingOrders = transactions
    .filter(t => t.status === 'Pending' || t.status === 'Processing')
    .length;
  
  return { totalSales, pendingOrders };
}

// Get transaction statistics by status
export function getTransactionsByStatus(transactions: MarketplaceTransaction[]) {
  const result: Record<TransactionStatus, number> = {
    'Completed': 0,
    'Pending': 0,
    'Failed': 0,
    'Processing': 0,
    'Refunded': 0
  };
  
  transactions.forEach(transaction => {
    result[transaction.status]++;
  });
  
  return result;
}
