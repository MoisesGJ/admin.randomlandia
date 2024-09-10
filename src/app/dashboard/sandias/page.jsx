'use client';

import Title from '@/components/dashboard/title.jsx';

import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

import { createSandia, createManySandias } from './actions';

export default function Sandias() {
  const [stateFile, setStateFile] = useState({ message: '', status: false });
  const [state, setState] = useState({ message: '', errors: {} });

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
          message: result?.errors?.global || '',
          errors: result?.errors || null,
          success: false,
        });
      } else {
        setState({
          message: '¡Se ha creado la sandía!',
          success: true,
        });

        await delay(1500);
        e.target.reset();
        setState({ message: '', errors: {} });
      }
    } catch (error) {
      console.error('Error:', error);
      setState({ message: 'Error de red', errors: {} });
    }
  };

  const handleDataSandiasFile = async (sandias) => {
    setLoading(true);

    try {
      const result = await createManySandias(sandias);

      await delay(1500);
      setLoading(false);

      if (!result?.success) {
        setStateFile({
          message: `Error al crear sandías: ${result.errors.global}`,
          status: false,
        });
      } else {
        setStateFile({ message: '¡Sandias añadidas!', status: true });

        await delay(1500);
        setStateFile({ message: '', status: false });
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      setStateFile({ message: 'Error de red', status: false });
    } finally {
      //await delay(1500);
      //setStateFile({ message: '', status: false });
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute z-10 top-0 -start-2 h-full w-screen backdrop-blur-sm"></div>
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
    setCheck(isCheck);
  };
  return (
    <>
      <SubTitle>Créalo manualmente</SubTitle>

      {state.message && (
        <div
          className={`text-white ${state.success ? 'bg-green-600' : 'bg-red-600'
            } px-3 py-1 my-3 mb-5 rounded-lg font-bold`}>
          {state.message}
        </div>
      )}

      <form
        className="flex flex-col gap-3 w-full md:w-10/12 bg-[#FDF1DF] shadow-sm rounded-2xl p-5"
        onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="topic"
            className="block mb-2 text-sm">
            Temas
          </label>
          <select
            id="topic"
            name="topic"
            className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            defaultValue={'base'}>
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
            message={state?.errors?.topic || 'Sin errores (aún)'}
            status={state?.errors?.topic}
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block mb-2 text-sm">
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
            message={state?.errors?.content || 'Sin errores (aún)'}
            status={state?.errors?.content}
          />
        </div>
        <div className="flex gap-3">
          <div className="w-full">
            <label
              htmlFor="question"
              className="block mb-2 text-sm">
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
          message={state?.errors?.question || 'Sin errores (aún)'}
          status={state?.errors?.question}
        />
        <span
          className={`${check ? 'text-green-600' : 'text-red-700'
            } ms-auto text-sm italic`}>
          Respuesta correcta: <b>{check ? 'Verdadero' : 'Falso'}</b>
        </span>
        <div>
          <label
            htmlFor="reference"
            className="block mb-2 text-sm">
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
            message={state?.errors?.reference || 'Sin errores (aún)'}
            status={state?.errors?.reference}
          />
        </div>
        <button
          type="submit"
          className="mx-5 p-2 bg-blue-text text-white rounded-3xl">
          Crear
        </button>
      </form>
    </>
  );
}

function DragDrop({ sandiasAll, state }) {
  const [showModal, setShowModal] = useState(false);
  const fileTypes = ['CSV'];

  const handleChange = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        sandiasAll(results.data);
      },
    });
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  return (
    <>
      <SubTitle>
        Sube un archivo
        <button
          className="text-sm underline ms-3"
          onClick={() => setShowModal(true)}>
          ¿Cómo lo subo?
        </button>
      </SubTitle>

      {showModal && <ModalInformation closeModal={setShowModal} />}

      {state.message && (
        <div
          className={`text-white ${state.status ? 'bg-green-600' : 'bg-red-600'
            } px-3 py-1 my-3 mb-5 rounded-lg font-bold`}>
          {state.message}
        </div>
      )}

      <div className="bg-[#FDF1DF] shadow-sm rounded-2xl h-32 w-full flex flex-col gap-4 [&>label]:min-h-full [&>label]:px-5 [&>label]:min-w-full [&>label>input]:w-fit [&>label]:border-none [&_label_div]:ms-2 [&_path]:fill-blue-text">
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          label={'Arrastra y suelta el archivo aquí...'}
        />
      </div>
    </>
  );
}

function ModalInformation({ closeModal }) {
  return (
    <div
      tabindex="-1"
      className="overflow-y-auto overflow-x-hidden fixed inset-0 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full z-50 backdrop-blur-sm">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-blue rounded-lg shadow p-5">
          <div className="flex items-center justify-between p-3 md:p-5 border-b rounded-t border-white/50">
            <h3 className="text-lg font-semibold text-white">
              ¿Cómo subir sandías 🍉?
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-white hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => closeModal(false)}>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Cierra el modal</span>
            </button>
          </div>

          <div
            className="p-4 md:p-5 overflow-y-auto max-h-[70vh]"
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitScrollbar: 'none',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}>
            <ol className="relative border-s border-gray-200 dark:border-gray-600 ms-3.5 mb-4 md:mb-5">
              <li className="mb-10 ms-8">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-white dark:ring-gray-700 dark:bg-gray-600">
                  <span className="font-bold text-white text-sm">1</span>
                </span>
                <h3 className="flex items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Plantilla CSV para sandías
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">
                    Latest
                  </span>
                </h3>
                <time className="block mb-3 text-sm font-normal leading-none text-gray-500 dark:text-gray-400">
                  Última versión el 21 de agosto, 2023
                </time>
                <button
                  type="button"
                  className="py-2 px-3 inline-flex items-center text-sm font-medium focus:outline-none  rounded-lg border  focus:z-10 focus:ring-4 focus:ring-gray-100 bg-gray-700 text-white border-gray-600"
                  onClick={() => (window.location.href = '/api/file')}>
                  <svg
                    className="w-3 h-3 me-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                  </svg>
                  Descargar
                </button>
              </li>
              <li className="mb-10 ms-8">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-white dark:ring-gray-700 dark:bg-gray-600">
                  <span className="font-bold text-white text-sm">2</span>
                </span>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Formatea las sandías de acuerdo al template
                </h3>
                <p className="text-white text-sm">
                  NOTA: poner el nombre del topic como se guarda en la base de
                  datos.
                </p>
              </li>
              <li className="ms-8 mb-10">
                <span className="absolute flex items-center justify-center w-6 h-6 p-1 bg-gray-600 rounded-full -start-3.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 fill-yellow-400">
                    <path
                      fill-rule="evenodd"
                      d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Si todo está bien verás un mensaje como{' '}
                  <span className="text-green-600">success</span> que indicará
                  que las sandías se agregaron
                </h3>
              </li>
              <li className="ms-8">
                <span className="absolute flex items-center justify-center w-6 h-6 p-1 bg-gray-600 rounded-full -start-3.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6 fill-red-400 stroke-white">
                    <path
                      fill-rule="evenodd"
                      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                <h3 className="mb-1 text-base font-medium text-gray-900 dark:text-white">
                  Si algo no sale como se espera, se mostrará un mensaje que
                  indicará <span className="text-red-600">error</span>
                </h3>
                <p className="text-sm text-gray-200 dark:text-gray-400">
                  Revisa que todas las celdas sean <i>strings</i> de más de dos
                  caracteres, que la columna de <i>answer</i> contenga solamente{' '}
                  <i>true</i> o <i>false</i>, según sea el caso, y que la
                  columna de <i>topics</i> contenga solo los títulos iguales
                  almacenados en la base de datos.
                </p>
              </li>
            </ol>
            <p className="text-white text-center">
              Powered by <b>Soni</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ message, status }) {
  return (
    <p
      className={`${status ? 'visible' : 'invisible'
        } text-red-500 text-sm whitespace-nowrap`}>
      {message}
    </p>
  );
}
