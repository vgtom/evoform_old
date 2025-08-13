import { Loader2 } from "lucide-react";
import React, { FC } from "react";

const Loading: FC<{ text?: string }> = ({ text = "Loading forms..." }) => {
  return (
    <div className="flex justify-center items-center h-full text-gray-500">
      <Loader2 className="animate-spin mr-2" /> {text}
    </div>
  );    
};

export default Loading;
