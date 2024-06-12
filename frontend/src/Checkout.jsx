import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./StripeStyles.css"; // Import the CSS file

const stripePromise = loadStripe(
  "pk_test_51OxuV3SEBT65OXS4xkT1SSHFtlrK5MJLzOC4hR6c48O0TeeLWGMR8CrbU0ZB4S8RFHeQRjOIZkRqM8wKIsZ4nMDg00HrCOzZpT"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = 2000; // Replace with your amount in cents

    const response = await axios.post(
      "http://localhost:3001/create-checkout-session",
      {
        amount,
      }
    );

    const sessionId = response.data.id;

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.error("Error redirecting to checkout:", error);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    classes: {
      base: "StripeElement", // Add your custom class
      focus: "StripeElement--focus",
      invalid: "StripeElement--invalid",
      webkitAutofill: "StripeElement--webkit-autofill",
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      <CardElement options={cardElementOptions} />
      <button
        type="submit"
        disabled={!stripe}
        style={{
          marginTop: "20px",
          padding: "10px 15px",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: "#6772e5",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Pay
      </button>
    </form>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;
