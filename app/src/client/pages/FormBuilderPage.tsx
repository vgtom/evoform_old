import React from "react";
import { useParams } from "react-router-dom";
import UserLayout from "../components/UserLayout";
<<<<<<< HEAD
import FormBuilder from "../components/FormBuilder/FormBuilder";
=======
import FormBuilder from "../components/FormChatBuilder/FormChatBuilder";
>>>>>>> main

const FormBuilderPage = () => {
  const { formSlug } = useParams();
  return (
<<<<<<< HEAD
    <UserLayout showSiderbar={false}>
=======
    <UserLayout>
>>>>>>> main
      <FormBuilder formSlug={formSlug} />
    </UserLayout>
  );
};

export default FormBuilderPage;
