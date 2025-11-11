"use client";

import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import OrderDetails from "@/shared/components/(user)/OrderItems/OrderDetails";
import OrderItems from "@/shared/components/(user)/OrderItems/OrderItems";

import Loader from "@/shared/components/(common)/Loader/Loader";
import OrdersInvoice from "@/shared/components/(common)/Invoices/OrdersInvoice";
import { GET_CUSTOMER_AND_ORDER_DATA } from "@/lib/apollo/queryes/customer";

/**
 * Renders the order details page based on the URL slug parameter.
 * @example
 * OrderDetailsPage({ params })
 * React component rendering order details
 * @param {Object} params - The parameters containing the order slug.
 * @returns {JSX.Element} Returns JSX markup to display order details.
 * @description
 *   - Retrieves and displays customer and order data using GraphQL query.
 *   - Handles URL query parameters for printing functionality.
 *   - Calculates and displays total purchase amount, tax, and order processing count.
 */
const OrderView = ({ params }) => {
  const [customerData, setCustomerData] = useState();
  const [order, setOrder] = useState();
  const [flag, setFlag] = useState(true);
  const [resolvedParams, setResolvedParams] = useState(null);
  
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);
  
  const orderId = resolvedParams?.slug;
  const { loading, data } = useQuery(GET_CUSTOMER_AND_ORDER_DATA, {
    variables: { orderId: orderId },
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    if (order?.increment_id && flag && queryParams.get("print") === "yes") {
      window.print();
      setFlag(false);

      queryParams.delete("print");
      const newUrl = `${window.location.origin}${window.location.pathname}${queryParams.toString()}`;

      window.history.replaceState({ path: newUrl }, "", newUrl);
    }
  }, [order, flag]);

  useEffect(() => {
    setCustomerData(data?.customer);
    setOrder(data?.customer.orders.items[0]);
  }, [data]);

  return loading ? (
    <Loader className="h-[calc(100vh-135px)]" />
  ) : (
    <div className="flex flex-col 2xl:flex-row w-full bg-[#F8F8FB] px-6 py-[26px] min-h-[calc(100vh-135px)] gap-5">
      <div className="w-full 2xl:w-2/3 flex flex-col gap-5">
        <OrderDetails customerData={customerData} order={order} />
        <OrderItems order={order} />
      </div>
      <OrdersInvoice customerData={customerData} orderData={order} />
    </div>
  );
};

export default OrderView;
