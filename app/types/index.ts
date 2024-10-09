export interface Transaction {
  _id: string;
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sold: boolean;
  dateOfSale: string;
}

export interface Statistics {
  totalSaleAmount: number;
  totalSoldItems: number;
  totalNotSoldItems: number;
}

export interface BarChartData {
  range: string;
  count: number;
}

export interface PieChartData {
  category: string;
  count: number;
}

export interface CombinedData {
  transactions: {
    transactions: Transaction[];
    total: number;
    page: number;
    perPage: number;
  };
  statistics: Statistics;
  barChartData: BarChartData[];
  pieChartData: PieChartData[];
}