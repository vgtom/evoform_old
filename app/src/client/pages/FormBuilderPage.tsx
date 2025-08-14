import React from "react";
import { useParams } from "react-router-dom";
import UserLayout from "../components/UserLayout";
import FormBuilder from "../components/FormBuilder/FormBuilder";

const FormBuilderPage = () => {
  const { formSlug } = useParams();
  return (
    <UserLayout showSiderbar={false}>
      <FormBuilder formSlug={formSlug} />
    </UserLayout>
  );
};

export default FormBuilderPage;
