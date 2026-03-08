import { useGetDashboardSummaryQuery } from "../store/api/dashboardApi";
import { useGetInvoicesQuery } from "../store/api/invoiceApi";
import { useMemo } from "react";

export function useDashboard() {
  // Lấy dữ liệu thống kê tổng hợp từ API Dashboard mới
  const { data: summaryData, isLoading: isLoadingSummary } = useGetDashboardSummaryQuery();
  
  // Lấy danh sách hóa đơn gần đây (có thể tái sử dụng API invoice list)
  const { data: recentInvoicesData, isLoading: isLoadingInvoices } = useGetInvoicesQuery({ page: 1, size: 5, sort: "id:desc" });

  const stats = useMemo(() => {
    const summary = summaryData?.data;
    const recentInvoices = recentInvoicesData?.data?.data || [];

    return {
      totalRooms: summary?.totalRooms || 0,
      occupiedRooms: summary?.occupiedRooms || 0,
      availableRooms: summary?.availableRooms || 0,
      occupancyRate: summary?.totalRooms ? Math.round((summary.occupiedRooms / summary.totalRooms) * 100) : 0,
      unpaidInvoices: summary?.unpaidInvoices || 0,
      totalRevenueMonth: summary?.totalRevenueMonth || 0,
      revenueChart: summary?.revenueChart || [],
      recentInvoices
    };
  }, [summaryData, recentInvoicesData]);

  return {
    ...stats,
    isLoading: isLoadingSummary || isLoadingInvoices
  };
}
