import AdminStatistics from "../../../components/Dashboard/Statistics/AdminStatistics";
import CustomerStatistics from "../../../components/Dashboard/Statistics/CustomerStatistics";
import SellerStatistics from "../../../components/Dashboard/Statistics/SellerStatistics";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import useRoll from "../../../hooks/useRoll";
const Statistics = () => {
  const [role, isRoleLoading] = useRoll();
  if (isRoleLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  return (
    <div>
      {role === "admin" && <AdminStatistics />}
      {role === "seller" && <SellerStatistics />}
      {role === "customer" && <CustomerStatistics />}
    </div>
  );
};

export default Statistics;
