"use client";

import Title from "@/components/dashboard/title.jsx";

import Papa from "papaparse";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

import { createSandia, createManySandias } from "./actions";

export default function Sandias() {
  const [stateFile, setStateFile] = useState({ message: "", status: false });
  const [state, setState] = useState({ message: "", errors: {} });

  const [loading, setLoading] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      setLoading(true);

      const result = await createSandia(formData);

      await delay(1500);
      setLoading(false);

      if (!result?.success) {
        setState({
          message: result?.errors?.global || "",
          errors: result?.errors || null,
          success: false,
        });
      } else {
        setState({
          message: "¡Se ha creado la sandía!",
          success: true,
        });

        await delay(1500);
        e.target.reset();
        setState({ message: "", errors: {} });
      }
    } catch (error) {
      console.error("Error:", error);
      setState({ message: "Error de red.", errors: {} });
    }
  };

  const handleDataSandiasFile = async (sandias) => {
    try {
      setLoading(true);

      console.log(sandias);

      const result = await createManySandias(sandias);

      await delay(1500);
      setLoading(false);

      if (!result?.success) {
        setStateFile({
          message: "Error al crear sandías, siga el formato del la plantilla.",
          status: false,
        });
      } else {
        setStateFile({ message: "¡Sandias añadidas!", status: true });

        await delay(1500);
      }
    } catch (error) {
      console.error("Error:", error);
      setStateFile({ message: "Error de red", status: false });
    } finally {
      await delay(1500);
      setStateFile({ message: "", status: false });
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute z-10 top-0 start-0 h-full w-screen backdrop-blur-sm"></div>
      )}
      <Title text="Crear sandías" />
      <section className="flex flex-col justify-center items-center pt-5">
        <DragDrop
          sandiasAll={handleDataSandiasFile}
          state={stateFile}
        />
        <div className="inline-flex items-center justify-center w-full relative">
          <hr className="w-96 h-px my-8 border-0 bg-gray-700" />
          <span className="absolute px-3 font-medium rounded-2xl -translate-x-1/2  left-1/2 text-white bg-gray-900">
            o
          </span>
        </div>
        <Form
          onSubmit={handleSubmit}
          state={state}
        />
      </section>
    </div>
  );
}

function SubTitle({ children }) {
  return <h2 className="text-md py-5 w-full">{children}</h2>;
}

function Form({ onSubmit, state }) {
  const [check, setCheck] = useState(true);

  const handleChecked = (isCheck) => {
    console.log(isCheck);
    setCheck(isCheck);
  };
  return (
    <>
      <SubTitle>Créalo manualmente</SubTitle>

      {state.message && (
        <div
          className={`text-white ${
            state.success ? "bg-green-600" : "bg-red-600"
          } px-3 py-1 my-3 mb-5 rounded-lg font-bold`}
        >
          {state.message}
        </div>
      )}

      <form
        className="flex flex-col gap-3 w-full md:w-10/12 bg-[#FDF1DF] shadow-sm rounded-2xl p-5"
        onSubmit={onSubmit}
      >
        <div>
          <label
            htmlFor="topic"
            className="block mb-2 text-sm"
          >
            Temas
          </label>
          <select
            id="topic"
            name="topic"
            className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            defaultValue={"base"}
          >
            <option value="base">Selecciona un tema</option>
            <option value="ciencias">Ciencias</option>
            <option value="deportes">Deportes</option>
            <option value="nerd">Nerd</option>
            <option value="idiomas">Idiomas</option>

            <option value="matematicas">Matemáticas</option>
            <option value="artes">Artes</option>
            <option value="mundo">Mundo</option>
            <option value="vida">Vida</option>
          </select>
          <ErrorMessage
            message={state?.errors?.topic || "Sin errores (aún)"}
            status={state?.errors?.topic}
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block mb-2 text-sm"
          >
            Dato
          </label>
          <textarea
            id="content"
            name="content"
            className="bg-white text-sm rounded-lg h-28 block w-full p-2.5 resize-none overflow-y-hidden"
            placeholder="Australia es más ancha que la Luna, ya que Australia mide casi 4000 kms de lado a lado, mientras que el diametro de la luna son 3400 kms aproximadamente."
            required
          />
          <ErrorMessage
            message={state?.errors?.content || "Sin errores (aún)"}
            status={state?.errors?.content}
          />
        </div>
        <div className="flex gap-3">
          <div className="w-full">
            <label
              htmlFor="question"
              className="block mb-2 text-sm"
            >
              Pregunta
            </label>
            <input
              type="text"
              id="question"
              name="question"
              className="bg-white text-sm rounded-lg block w-full p-2.5"
              placeholder="¿A Randy le gustan las semillas?"
              required
            />
          </div>
          <label className="inline-flex items-center cursor-pointer h-10 mt-auto">
            <input
              type="checkbox"
              name="answer"
              className="sr-only peer"
              onChange={(e) => handleChecked(e.target.checked)}
              checked={check}
            />
            <div className="relative w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer bg-red-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-green-600"></div>
          </label>
        </div>
        <ErrorMessage
          message={state?.errors?.question || "Sin errores (aún)"}
          status={state?.errors?.question}
        />
        <span
          className={`${
            check ? "text-green-600" : "text-red-700"
          } ms-auto text-sm italic`}
        >
          Respuesta correcta: <b>{check ? "Verdadero" : "Falso"}</b>
        </span>
        <div>
          <label
            htmlFor="reference"
            className="block mb-2 text-sm"
          >
            Fuente bibliográfica
          </label>
          <input
            type="text"
            id="reference"
            name="reference"
            className="bg-white text-sm rounded-lg block w-full p-2.5"
            placeholder="R. (2000, August 22). Randy y las RandyAventuras. Randomlandia. Retrieved December 12, 2023, from https://randomlandia.com"
            required
          />
          <ErrorMessage
            message={state?.errors?.reference || "Sin errores (aún)"}
            status={state?.errors?.reference}
          />
        </div>
        <button
          type="submit"
          className="mx-5 p-2 bg-blue-text text-white rounded-3xl"
        >
          Crear
        </button>
      </form>
    </>
  );
}

function DragDrop({ sandiasAll, state }) {
  const fileTypes = ["CSV"];

  const handleChange = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        sandiasAll(results.data);
      },
    });
  };

  return (
    <>
      <SubTitle>Sube un archivo</SubTitle>

      {state.message && (
        <div
          className={`text-white ${
            state.status ? "bg-green-600" : "bg-red-600"
          } px-3 py-1 my-3 mb-5 rounded-lg font-bold`}
        >
          {state.message}
        </div>
      )}

      <div className="bg-[#FDF1DF] shadow-sm rounded-2xl h-32 w-full flex flex-col gap-4 [&>label]:min-h-full [&>label]:px-5 [&>label]:min-w-full [&>label>input]:w-fit [&>label]:border-none [&_label_div]:ms-2 [&_path]:fill-blue-text">
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          label={"Arrastra y suelta el archivo aquí..."}
        />
      </div>
    </>
  );
}

function ErrorMessage({ message, status }) {
  return (
    <p
      className={`${
        status ? "visible" : "invisible"
      } text-red-500 text-sm whitespace-nowrap`}
    >
      {message}
    </p>
  );
}
