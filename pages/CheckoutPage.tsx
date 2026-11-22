import React from "react";
import { Navigate } from "react-router-dom";

/** Legacy route compatibility: direct visitors to the current school plans. */
export default function CheckoutPage(): React.ReactElement {
  return <Navigate to="/pricing#school-plans" replace />;
}
