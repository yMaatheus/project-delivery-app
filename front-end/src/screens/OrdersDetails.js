import { Fragment, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailsDescription from '../components/DetailsDescription';
import NavBar from '../components/NavBar/NavBar';
import OrderTable from '../components/OrderTable';
import { useUser } from '../context/user-context';
import { getSaleDetails } from '../services/sales';

function OrdersDetails() {
  const { user } = useUser();
  const { id } = useParams();

  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const getDetails = useCallback(async () => {
    const response = await getSaleDetails(id);
    setDetails(response);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  const { products } = details;

  const totalPrice = products?.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0,
  );

  return (
    <>
      <NavBar client={ user?.role } />
      {loading ? (
        <p>carregando...</p>
      ) : (
        <>
          <DetailsDescription { ...details } />
          <OrderTable products={ products } />
          <p data-testid="customer_order_details__element-order-total-price">
            {
              `Total: R$ ${totalPrice.toFixed(2)
                .toString()
                .replace(/\./, ',')}`
            }
          </p>
        </>
      )}
    </>
  );
}

export default OrdersDetails;
