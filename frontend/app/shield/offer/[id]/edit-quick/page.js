"use client";
import { use } from "react";
import SimpleOfferEditForm from "@/components/offer/SimpleOfferEditForm";

export default function EditQuickPage({ params }) {
  const { id } = use(params);
  return <SimpleOfferEditForm offerId={id} />;
}
