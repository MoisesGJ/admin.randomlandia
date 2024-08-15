"use client";

import Title from "@/components/dashboard/title.jsx";

import Link from "next/link";
import Papa from "papaparse";
import { FileUploader } from "react-drag-drop-files";

export default function Sandias() {
  return (
    <>
      <Title text="Crear sandías" />
      <section className="h-48 bg-red-300 flex justify-center items-center">
        <h1>En construccióooooon....</h1>
        <DragDrop />
      </section>
    </>
  );
}

function DragDrop() {
  const fileTypes = ["CSV"];

  const handleChange = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        update(results.data);
      },
    });
  };

  return (
    <div className="mt-5 flex flex-col gap-4 [&>label]:border-none [&>label]:my-5  [&_label_div]:ms-2 [&_path]:fill-blue-text">
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        label={"Arrastra y suelta el archivo aquí..."}
      />
    </div>
  );
}
