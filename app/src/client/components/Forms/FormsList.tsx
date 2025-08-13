import React, { FC } from "react";
import { useQuery, getForms } from "wasp/client/operations";
import { Plus, Loader2, Edit2 } from "lucide-react";
import Loading from "../../../components/Loading";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";

const FormsList: FC<{ searchText?: string }> = ({ searchText }) => {
  const { data, isLoading, error } = useQuery(getForms, { page: 1, limit: 10, search: searchText });
  const navigate = useNavigate();

  const handleEditClick = (formSlug: string) => {
    navigate(`/forms/${formSlug}`);
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-red-500 text-center mt-4">
        Error loading forms: {error.message}
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-500">
        <p>No forms found.</p>
        <button className="mt-4 flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">
          <Plus className="w-4 h-4 mr-1" /> New Form
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10">
      {data.items.map((form) => (
        <div
          key={form.id}
          className="p-4 border border-green-800 hover:border-green-500 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition"
        >
          <h3 className="font-semibold text-lg text-gray-800">{form.title}</h3>
          {form.description && (
            <p className="text-sm text-gray-600 mt-1">{form.description}</p>
          )}
          <Button
            className="mt-5"
            size={"sm"}
            variant={"outline"}
            onClick={() => handleEditClick(form.slug)}
          >
            {" "}
            <Edit2 /> Edit
          </Button>
          {/* <div className="mt-3 text-xs text-gray-400">
            {form.fields?.length || 0} fields · {form.status}
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default FormsList;
