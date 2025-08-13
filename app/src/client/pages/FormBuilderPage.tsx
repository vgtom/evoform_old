import React from "react";
import { useParams } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import FormBuilder from "../components/FormChatBuilder/FormChatBuilder";

const FormBuilderPage = () => {
  const { formSlug } = useParams();
  return (
    <UserLayout>
      <FormBuilder formSlug={formSlug} />
    </UserLayout>
  );
};

export default FormBuilderPage;
