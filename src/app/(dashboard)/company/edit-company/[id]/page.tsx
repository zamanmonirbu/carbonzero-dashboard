"use client";

import React from "react";
import { useParams } from "next/navigation";
import EditCompany from "@/components/editCompany";

const EditCompanyPage = () => {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div>
      <EditCompany id={id} />
    </div>
  );
};

export default EditCompanyPage;
