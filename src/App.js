import { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInittial = true;

function App() {
    const dispatch = useDispatch();

    const showCart = useSelector((state) => state.ui.cartIsVisible);
    const cart = useSelector((state) => state.cart);
    const notification = useSelector((state) => state.ui.notification);

    useEffect(() => {
        const sendCartData = async () => {
            dispatch(
                uiActions.showNotofication({
                    status: "pending",
                    title: "Sending...",
                    message: "Sending cart data!",
                })
            );

            const response = await fetch(
                "https://redux-cart-65759-default-rtdb.europe-west1.firebasedatabase.app/cart.json",
                { method: "PUT", body: JSON.stringify(cart) }
            );

            if (!response.ok) {
                throw new Error("Sending cart data failed!");
            }

            dispatch(
                uiActions.showNotofication({
                    status: "success",
                    title: "Success!",
                    message: "Sent cart successfuly!",
                })
            );
        };

        if (isInittial) {
            isInittial = false;
            return;
        }

        sendCartData().catch((error) => {
            dispatch(
                uiActions.showNotofication({
                    status: "error",
                    title: "Error!",
                    message: "Sending cart data failed!",
                })
            );
        });
    }, [cart, dispatch]);

    return (
        <Fragment>
            {notification && (
                <Notification
                    status={notification.status}
                    title={notification.title}
                    message={notification.message}
                />
            )}
            <Layout>
                {showCart && <Cart />}
                <Products />
            </Layout>
        </Fragment>
    );
}

export default App;
