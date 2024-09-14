'use client'

import Title from "@/components/dashboard/title"
import { useEffect, useRef, useState } from "react"
import { getOrders, createProduct, editProduct, removeProduct } from "./actions"
import Image from "next/image"
import { FileUploader } from "react-drag-drop-files"
import Papa from 'papaparse';

export default function Ecommerce() {
    const [orders, setOrders] = useState([])
    const [messageError, setMessageError] = useState(false)
    const [errorModal, setErrorModal] = useState(false)
    const [messageSuccess, setMessageSuccess] = useState(false)
    const [modalOrders, setModalOrders] = useState(false)
    const [state, setState] = useState({ message: '', errors: {} });
    const [formData, setFormData] = useState({
        id: '',
        email: "",
        totalAmount: "",
        order: "",
        createdAt: "",
        status: "",
        items: ''
    });
    const [update, setUpdate] = useState(false)
    const [file, setFile] = useState(null)

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        const getOrdersData = async () => {
            const resp = await getOrders()
            if (resp.error) {
                setMessageError(resp.error.global)
                return setOrders(null)
            }

            setOrders(resp)
        }

        getOrdersData()
    }, [update])

    useEffect(() => {
        if (modalOrders) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [modalOrders]);

    const handleMessageSuccess = (msg) => {
        setUpdate(!update)
        setMessageSuccess(msg)
        setTimeout(() => setMessageSuccess(false), 3000)
    }

    const resetFormData = () => {
        setFormData({
            id: '',
            email: "",
            totalAmount: "",
            order: "",
            createdAt: "",
            status: "",
            items: ''
        })
        setState({ message: '', errors: {} })
    }


    const handleOpenModal = (id) => {
        resetFormData()
        if (id) {
            const currOrders = orders.slice()

            const currOrderId = currOrders.find((order) => order._id === id)

            setFormData(currOrderId)
        }
        setModalOrders(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdjuntFile = async (data) => {
        if (data) {
            setFile(data)
            setState({ message: '¡Se añadió el archivo!', errors: {} })
        } else {
            setState({ message: 'Hubo un error con este documento...', errors: {} })
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await createProduct(formData)

            if (!result.success) {
                setState({
                    message: result?.errors?.global || '',
                    errors: result?.errors || null,
                });
                result?.errors?.global && setMessageError(result.errors.global)
            } else {
                resetFormData()
                setModalOrders(false)
                await delay(500);
                handleMessageSuccess(`¡Se envió la información satisfactoriamente!`)
            }

        } catch (error) {
            setModalOrders(false)

            await delay(1500);

            console.error('Error:', error);
            setMessageError({ message: 'Hubo un error.', errors: {} });
        } finally {

        }
    }


    const handleRemoveProduct = async () => {
        const currOrderId = formData._id

        if (!currOrderId) handleErrorModal('El producto no se encuentra')

        const isRemove = await removeProduct(currOrderId)

        if (!isRemove) handleErrorModal(isRemove.errors.global)

        setModalOrders(false)
        await delay(500);
        handleMessageSuccess('Producto borrado satisfactoriamente.')
    }

    const handleErrorModal = (msg) => {
        setErrorModal(msg)

        setTimeout(() => setErrorModal(false), 3000)
    }

    return <div className="relative">
        <Title text="Seguimiento de ordenes" />

        {messageError && (
            <div
                className='text-white bg-red-600 px-3 py-1 my-3 mb-5 rounded-lg font-bold'>
                {messageError}
            </div>
        )}
        {messageSuccess && (
            <div
                className='fixed top-10 z-[51] start-1/2 text-white bg-green-600 p-3 my-3 mb-5 rounded-lg font-bold'>
                {messageSuccess}
            </div>
        )}

        {modalOrders && <ModalOrders closeModal={setModalOrders} handleSubmit={handleSubmit} state={state} handleChange={handleChange} formData={formData} removeProduct={handleRemoveProduct} reset={resetFormData} handleAdjuntFile={handleAdjuntFile} errorModal={errorModal} fileExists={file ? true : false} />}

        <div className="relative overflow-x-auto mt-8 rounded-lg">
            <Table>
                {orders?.map((order, index) => {
                    return <Row key={order._id}>
                        <HeaderCeil scope="row" classnames="font-bold whitespace-nowrap group">
                            <button className="flex justify-center items-center gap-1 h-full w-8" onClick={() => handleOpenModal(order._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden lg:inline-block size-6 lg:group-hover:scale-150 transition-transform duration-300">
                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                </svg>

                                <span className="underline lg:no-underline inline-block lg:group-hover:hidden font-medium text-blue-500">{index + 1}</span>
                            </button>
                        </HeaderCeil>
                        <Ceil classnames='lowercase overflow-x-auto'>
                            <a href={`mailto:${order.email}`} className="inline-block w-52 hover:font-semibold hover:text-yellow-600">{order.email}</a>
                        </Ceil>
                        <Ceil classnames='w-30 h-18 overflow-x-auto flex justify-center -space-x-4 relative'>
                            {order.items.map(({ name, count, images }, index) => {
                                return <div key={index} className="even:rotate-[10deg] odd:rotate-[-10deg] relative group">
                                    <span className="absolute start-1/2 transition -translate-x-1/2 -top-4 z-10 font-bold text-red-600 text-sm group-hover:-top-5">{count}</span>
                                    <Image src={images[0]} alt={name} width={40} height={40} className="relative -z-10 group-hover:scale-150" />
                                </div>
                            })}
                        </Ceil>
                        <Ceil classnames='text-center'>
                            $&nbsp;{order.totalAmount}
                        </Ceil>
                        <Ceil classnames='text-end'>
                            {order.status}
                        </Ceil>
                    </Row>

                })}
                {(orders?.length < 1) && <Skeleton />}
            </Table>
        </div>
    </div>
}

function Skeleton() {
    return Array.from({ length: 6 }).map((__, index) => {
        return <Row key={index}>
            <HeaderCeil scope="row" classnames='size-20'>
                <div className="animate-pulse w-18 h-4 bg-gray-500/30"></div>
            </HeaderCeil>
            <Ceil classnames='size-20'>
                <div className="animate-pulse w-18 h-12 bg-gray-500/30"></div>
            </Ceil>
            <Ceil>
                <div className="animate-pulse w-18 h-4 bg-gray-500/30"></div>
            </Ceil>
            <Ceil>
                <div className="ms-auto animate-pulse w-8 h-4 bg-gray-500/30"></div>
            </Ceil>
            <Ceil>
                <div className="ms-auto animate-pulse w-8 h-4 bg-gray-500/30"></div>
            </Ceil>
        </Row>
    })
}

function Table({ children }) {
    return <table className="table-auto w-full">
        <thead className="text-xs text-white uppercase bg-blue">
            <tr>
                <HeaderCeil>
                    Nro.
                </HeaderCeil>
                <HeaderCeil>
                    Contacto
                </HeaderCeil>
                <HeaderCeil>
                    Compra
                </HeaderCeil>
                <HeaderCeil>
                    Total
                </HeaderCeil>
                <HeaderCeil>
                    Estado
                </HeaderCeil>
            </tr>
        </thead>
        <tbody>
            {children}
        </tbody>
    </table>
}


function Row({ classnames, children }) {
    return <tr className={`${classnames} odd:bg-gray-100/30 even:bg-blue/10 border-b border-gray-400`}>
        {children}
    </tr>
}

function HeaderCeil({ classnames, children, scope = 'col' }) {
    return <th scope={scope} className={`${classnames} px-6 py-3`}>
        {children}
    </th>
}

function Ceil({ classnames, children }) {
    return <td className={`${classnames} px-6 py-4`} style={{
        overflow: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: 'white transparent',
    }} >
        {children}
    </td>
}

function ModalOrders({ closeModal, handleSubmit, handleAdjuntFile, state, handleChange, errorModal, formData, removeProduct, reset, fileExists }) {

    const orderRef = useRef(null)

    return (
        <div
            tabIndex="-1"
            className="overflow-y-auto overflow-x-hidden fixed inset-0 flex justify-center items-center w-full max-h-full z-50 backdrop-blur-sm overflow-hidden">
            <div className="relative p-4 w-full max-w-xl h-[calc(100%-1rem)]">
                <div className="relative bg-blue rounded-lg shadow p-5">
                    {errorModal && <span className="absolute z-[51] top-1/2 transition -translate-y-1/2 h-24 bg-red-600 text-center text-2xl font-bold text-white w-11/12 truncate flex justify-center items-center">{errorModal}</span>}
                    <div className="flex items-center justify-between p-3 md:p-5 border-b rounded-t border-white/50">
                        <h3 className="text-lg font-semibold text-white">
                            Envía el producto 🛩️
                        </h3>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-white hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => removeProduct()}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                                    <path fillRule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.133 2.845a.75.75 0 0 1 1.06 0l1.72 1.72 1.72-1.72a.75.75 0 1 1 1.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 1 1-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 1 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>

                                <span className="sr-only">Eliminar producto</span>
                            </button>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-white hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => reset()}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                </svg>

                                <span className="sr-only">Limpia el formulario</span>
                            </button>

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
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Cierra el modal</span>
                            </button>
                        </div>
                    </div>

                    <form
                        className="p-4 md:p-5 overflow-y-auto max-h-[70vh]"
                        style={{
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            WebkitScrollbar: 'none',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                        }} onSubmit={handleSubmit}>
                        <ol className="relative border-s border-gray-600 ms-3.5 mb-4 md:mb-5">
                            <li className="mb-10 ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3.5 bg-gray-300">
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contacto</label>

                                    <a href={`mailto:${formData.email}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 truncate hover:text-lg h-10" >{formData.email}
                                    </a>
                                </div>
                            </li>
                            <li className="mb-10 ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3.5 bg-gray-300">
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white w-full">
                                    <label htmlFor="order" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Orden</label>
                                    <p className="break-all w-100">
                                        <span ref={orderRef} className="selection:bg-white selection:text-blue">{formData.order}</span> &nbsp;
                                        <button type="button" onClick={() => {
                                            const handleSelectText = () => {
                                                const range = document.createRange();
                                                const selection = window.getSelection();
                                                range.selectNodeContents(orderRef.current); // Selecciona el contenido del <p>
                                                selection.removeAllRanges(); // Limpia cualquier selección previa
                                                selection.addRange(range); // Selecciona el texto del rango
                                            };

                                            if (!navigator.clipboard) {
                                                navigator.clipboard.writeText(`${formData.order}`)
                                                    .then(() => {
                                                        handleSelectText();
                                                    })
                                                    .catch(() => {
                                                        alert("No se pudo copiar");
                                                    });
                                            } else {
                                                navigator.clipboard.writeText(`${formData.order}`).then(
                                                    function () {
                                                        handleSelectText()
                                                    })
                                                    .catch(
                                                        function () {
                                                            alert("No se pudo copiar");
                                                        });
                                            }

                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" className="size-6 fill-none stroke-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                            </svg>
                                        </button>
                                    </p>
                                </div>
                            </li>
                            <li className="ms-8 mb-10">
                                <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3.5 bg-gray-300">
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label htmlFor="images" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Artículos</label>
                                    <ul>
                                        {
                                            formData.items.map((item) => {
                                                return <li key={item.id}>
                                                    <div className="flex gap-2">
                                                        <Image src={item.images[0]} width={50} height={50} alt={item.name} />
                                                        <span>{item.count} comprado{item.count === 1 ? '' : 's'} a $ {item.price} cada uno</span>
                                                    </div>
                                                </li>
                                            })
                                        }
                                    </ul>
                                </div>
                            </li>
                            <li className="ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3.5 bg-gray-300">
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label htmlFor="totalAmount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cobro</label>
                                    <p id="totalAmount" name='totalAmount' >
                                        $&nbsp;{formData.totalAmount}
                                    </p>
                                </div>
                            </li>
                            <li className="ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3.5 bg-gray-300">
                                </span>
                                <div className="flex flex-col items-start mt-3 mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>

                                    <p id="price" className={`px-3 ${formData.status === 'pending' ? 'bg-yellow-500' : (formData.status === 'paid' ? 'bg-green-600' : 'bg-white')}`} name='price'>{formData.status}</p>
                                </div>
                            </li>
                            <li className="ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3.5 bg-gray-300">
                                </span>
                                <div className="flex flex-col items-start mt-3 mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subir guia de envío</label>

                                    <DragDrop
                                        senderOrder={handleAdjuntFile}
                                        message={state.message}
                                    />
                                </div>
                            </li>
                            <li className="ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3.5 top-full ring-8 dark:ring-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 font-bold text-white text-sm">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <br />
                            </li>
                        </ol>
                        <div className="ms-12 flex items-start flex-col gap-y-4">
                            {fileExists || <span className="text-white ms-3 text-xs">Sube un archivo válido para enviar el correo</span>}
                            <button disabled={!fileExists} type="submit" className="bg-white p-3 rounded-full font-bold border-[.5px] hover:border-white hover:bg-blue hover:text-white disabled:bg-gray-100 disabled:hover:bg-gray-100 disabled:hover:text-blue">Enviar mediante correo electrónico</button>

                        </div>
                    </form>

                </div>
            </div>
        </div >
    );
}

function DragDrop({ senderOrder, message }) {
    const fileTypes = ['PDF'];

    const handleChange = (file) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                senderOrder(results.data);
            },
        });
    };


    return (
        <>
            <span className="pb-2 text-sm italic">{message}</span>
            <div className="bg-white shadow-sm rounded-2xl h-32 w-full flex flex-col gap-4 [&>label]:min-h-full [&>label]:px-5 [&>label]:w-full [&>label>input]:w-fit [&>label]:border-none [&_label_div]:ms-2 [&_path]:fill-blue-text">
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