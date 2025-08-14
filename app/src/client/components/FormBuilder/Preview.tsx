import { Link2, LucideLock, RefreshCcw } from "lucide-react";
import { useFormBuilderStore } from "../../store";
import { File, Field } from "wasp/entities";
import { FC, useEffect, useState } from "react";
import { getDownloadFileSignedURL } from "wasp/client/operations";
import { Input } from "../../../components/ui/input";
import PlaceholderImage from '../../static/placeholder.png'

type PreviewProps = {
  clickedField?: Field & { coverImage?: File | null };
};

const Preview: FC<PreviewProps> = ({ clickedField }) => {

  const [coverImageUrl, setCoverImageUrl] = useState("")
  const { storedForm } = useFormBuilderStore();
  useEffect(() => {
    const storedCoverImageKey = storedForm?.fields.find(
      (field) => field.id === clickedField?.id
    )?.coverImage?.key;
    if (!storedCoverImageKey) {
      setCoverImageUrl("");
      return;
    }
    getDownloadFileSignedURL({ key: storedCoverImageKey }).then((res) => {
      console.log(res);
      setCoverImageUrl(res);
    });
  }, [clickedField?.id, storedForm?.fields]);

  useEffect(() => {
    console.log("Stored form changed")
  }, [storedForm])

  return (
    <div className="h-full min-h-[500px]  grid grid-rows-[max-content_1fr] bg-white shadow ">
      <nav className="flex justify-between p-2 items-center px-4 ">
        <div className="flex gap-1">
          <span className="rounded-full w-3 h-3 bg-gray-300" />
          <span className="rounded-full w-3 h-3 bg-gray-300" />
          <span className="rounded-full w-3 h-3 bg-gray-300" />
        </div>
        <div className="bg-gray-100 w-[300px] p-1 rounded-sm flex gap-2">
          <LucideLock />
          <p className="text-xs line-clamp-1 leading-loose hover:underline cursor-pointer">
            {`${location.host}/fill/${storedForm?.slug}`}
          </p>
          <button
            onClick={() =>
              window.navigator.clipboard.writeText(
                `${location.host}/fill/${storedForm?.slug}`
              )
            }
          >
            <Link2 />
          </button>
        </div>
        <div className="">
          <button>
            <RefreshCcw size={20} />
          </button>
        </div>
      </nav>

      <div className="relative bg-gray-900 h-full w-full text-white ">
        {coverImageUrl && <img className="absolute top-0 left-0 h-full w-full object-cover" src={coverImageUrl} alt="" />}
        <div className="relative z-20 flex justify-center items-center h-full -mt-10">
          <div>
            <p className="text-[40px]">{clickedField?.title}</p>
            <Input placeholder="Answer here..." className="border-0 border-b-4 border-white rounded-none min-w-[100px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
