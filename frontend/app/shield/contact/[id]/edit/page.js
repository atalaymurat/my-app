"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/utils/axios";
import ContactForm from "@/components/contact/form";

const EditContactPage = () => {
  const { id } = useParams();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    const getContact = async () => {
      try {
        const { data } = await axios.get(`/api/contact/${id}`);
        setContact(data.contact);
      } catch (err) {
        console.error("Error fetching contact:", err);
      }
    };
    getContact();
  }, [id]);

  if (!contact) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 flex flex-col gap-4 w-full">
      <div className="font-bold text-2xl text-white">Kişi Düzenle</div>
      <ContactForm contact={contact} />
    </div>
  );
};

export default EditContactPage;
