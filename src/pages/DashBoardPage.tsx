export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Dashboard</h1>
      <p className="mt-4 text-gray-600">Chào mừng bạn đã đăng nhập thành công!</p>
      <a href="/auth" className="mt-6 text-blue-500 hover:underline">Quay lại trang Đăng nhập</a>
    </div>
  );
}
