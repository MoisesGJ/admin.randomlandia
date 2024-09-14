'use client'

import Title from "@/components/dashboard/title"
import { useEffect, useState } from "react"
import { getProducts, createProduct, editProduct, removeProduct } from "./actions"
import Image from "next/image"

export default function Ecommerce() {
    const [products, setProducts] = useState([])
    const [messageError, setMessageError] = useState(false)
    const [errorModal, setErrorModal] = useState(false)
    const [messageSuccess, setMessageSuccess] = useState(false)
    const [modalProducts, setModalProducts] = useState(false)
    const [action, setAction] = useState('');
    const [state, setState] = useState({ message: '', errors: {} });
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        images: "",
        category: ""
    });
    const [update, setUpdate] = useState(false)

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    useEffect(() => {
        const getProductsData = async () => {
            const resp = await getProducts()
            if (resp.error) {
                setMessageError(resp.error.global)
                return setProducts(null)
            }

            setProducts(resp)
        }

        getProductsData()
    }, [update])

    useEffect(() => {
        if (modalProducts) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [modalProducts]);

    const handleMessageSuccess = (msg) => {
        setUpdate(!update)
        setMessageSuccess(msg)
        setTimeout(() => setMessageSuccess(false), 3000)
    }

    const resetFormData = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            images: "",
            category: ""
        })
        setState({ message: '', errors: {} })
    }


    const handleOpenModal = (id) => {
        resetFormData()
        if (id) {
            const currProducts = products.slice()

            const currProductId = currProducts.find((product) => product._id === id)

            const arrayToStringInImages = { _id: currProductId._id, ...currProductId, images: currProductId.images.join(', '), }

            setFormData(arrayToStringInImages)
        }
        setModalProducts(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let result;

            if (action === 'create-product') {
                result = await createProduct(formData)
            } else if (action === 'edit-product') {
                result = await editProduct(formData._id, formData)
            }

            if (!result.success) {
                setState({
                    message: result?.errors?.global || '',
                    errors: result?.errors || null,
                });
                result?.errors?.global && setMessageError(result.errors.global)
            } else {
                resetFormData()
                setModalProducts(false)
                await delay(500);
                handleMessageSuccess(`¡Producto ${action === 'create-product' ? 'creado' : 'editado'} satisfactoriamente!`)
            }

        } catch (error) {
            setModalProducts(false)

            await delay(1500);

            console.error('Error:', error);
            setMessageError({ message: 'Hubo un error.', errors: {} });
        } finally {

        }
    }


    const handleRemoveProduct = async () => {
        const currProductId = formData._id

        if (!currProductId) handleErrorModal('El producto no se encuentra')

        const isRemove = await removeProduct(currProductId)

        if (!isRemove) handleErrorModal(isRemove.errors.global)

        setModalProducts(false)
        await delay(500);
        handleMessageSuccess('Producto borrado satisfactoriamente.')
    }

    const handleErrorModal = (msg) => {
        setErrorModal(msg)

        setTimeout(() => setErrorModal(false), 3000)
    }

    return <div className="relative">
        <Title text="Nuestros productos" />

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

        {modalProducts && <ModalProducts closeModal={setModalProducts} action={action} handleSubmit={handleSubmit} state={state} handleChange={handleChange} formData={formData} removeProduct={handleRemoveProduct} reset={resetFormData} errorModal={errorModal} />}

        <div className="relative overflow-x-auto mt-8 rounded-lg">
            <Table>
                {products?.map((product) => {
                    return <Row key={product._id}>
                        <HeaderCeil scope="row" classnames="font-bold whitespace-nowrap group">
                            <div className="size-20 flex justify-center items-center">
                                <Image className="hidden lg:group-hover:block" src={product.images[0]} alt={product.name} height={80} width={80} priority />
                                <span className="inline lg:group-hover:hidden">{product.name}</span>
                            </div>
                        </HeaderCeil>
                        <Ceil>
                            {product.description}
                        </Ceil>
                        <Ceil classnames='capitalize'>
                            {product.category}
                        </Ceil>
                        <Ceil>
                            $ {product.price}
                        </Ceil>
                        <Ceil classnames='group'>
                            <button className="flex justify-center items-center gap-1 w-full h-full" onClick={() => {
                                setAction('edit-product')
                                handleOpenModal(product._id)
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden lg:inline-block size-6 lg:group-hover:scale-150 transition-transform duration-300">
                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                </svg>

                                <span className="underline lg:no-underline inline-block lg:group-hover:hidden font-medium text-blue-500">Editar</span>
                            </button>
                        </Ceil>
                    </Row>

                })}
                {(products?.length < 1) && <Skeleton />}
            </Table>
        </div>
        {(products?.length > 1) && <div className="h-12 w-full flex justify-end p-3">
            <button className="hover:underline font-medium italic" onClick={() => {
                handleOpenModal();
                setAction('create-product')
            }}>
                + Añadir otro producto
            </button>
        </div>}
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
                    Nombre
                </HeaderCeil>
                <HeaderCeil>
                    Descripción
                </HeaderCeil>
                <HeaderCeil>
                    Categoría
                </HeaderCeil>
                <HeaderCeil>
                    Precio
                </HeaderCeil>
                <HeaderCeil>
                    Acción
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
    return <td className={`${classnames} px-6 py-4`} >
        {children}
    </td>
}

function ModalProducts({ closeModal, action, handleSubmit, state, handleChange, errorModal, formData, removeProduct, reset }) {
    return (
        <div
            tabIndex="-1"
            className="overflow-y-auto overflow-x-hidden fixed inset-0 flex justify-center items-center w-full max-h-full z-50 backdrop-blur-sm overflow-hidden">
            <div className="relative p-4 w-full max-w-xl h-[calc(100%-1rem)]">
                <div className="relative bg-blue rounded-lg shadow p-5">
                    {errorModal && <span className="absolute z-[51] top-1/2 transition -translate-y-1/2 h-24 bg-red-600 text-center text-2xl font-bold text-white w-11/12 truncate flex justify-center items-center">{errorModal}</span>}
                    <div className="flex items-center justify-between p-3 md:p-5 border-b rounded-t border-white/50">
                        <h3 className="text-lg font-semibold text-white">
                            {action === 'create-product' ? 'Añade' : 'Edita'} un producto 🛒
                        </h3>
                        <div className="flex space-x-2">
                            {action === 'edit-product' && <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-white hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => removeProduct()}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                                    <path fillRule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.133 2.845a.75.75 0 0 1 1.06 0l1.72 1.72 1.72-1.72a.75.75 0 1 1 1.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 1 1-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 1 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>

                                <span className="sr-only">Eliminar producto</span>
                            </button>}

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
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-white dark:ring-gray-700 dark:bg-gray-600">
                                    <span className="font-bold text-white text-sm">1</span>
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre del producto</label>
                                    {state?.errors?.name && (
                                        <ErrorMessage message={state.errors.name} />
                                    )}
                                    <input type="text" id="name" name='name' value={formData.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 truncate" placeholder="Suéter" required />
                                </div>
                            </li>
                            <li className="mb-10 ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-white dark:ring-gray-700 dark:bg-gray-600">
                                    <span className="font-bold text-white text-sm">2</span>
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                                    {state?.errors?.description && (
                                        <ErrorMessage message={state.errors.description} />
                                    )}
                                    <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 truncate" placeholder="Linda playera azul marino con nuestro personaje Randy, perfecta para cualquier día." required />
                                </div>
                            </li>
                            <li className="ms-8 mb-10">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-white dark:ring-gray-700 dark:bg-gray-600">
                                    <span className="font-bold text-white text-sm">3</span>
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label htmlFor="images" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imágenes</label>
                                    {state?.errors?.images && (
                                        <ErrorMessage message={state.errors.images} />
                                    )}
                                    <input type="text" id="images" name="images" value={formData.images} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 truncate" placeholder="cdn.randomlandia.com/sueter1, cdn.randomlandia.com/sueter2" required />
                                </div>
                            </li>
                            <li className="ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-white dark:ring-gray-700 dark:bg-gray-600">
                                    <span className="font-bold text-white text-sm">4</span>
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoría</label>
                                    {state?.errors?.category && (
                                        <ErrorMessage message={state.errors.category} />
                                    )}
                                    <input type="text" id="category" name='category' value={formData.category} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="playera" required />
                                </div>
                            </li>
                            <li className="ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-white dark:ring-gray-700 dark:bg-gray-600">
                                    <span className="font-bold text-white text-sm">5</span>
                                </span>
                                <div className="flex flex-col items-start mt-3 mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precio</label>
                                    {state?.errors?.price && (
                                        <ErrorMessage message={state.errors.price} />
                                    )}
                                    <input type="number" id="price" name='price' value={formData.price} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="300" required />
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
                        <div className="ms-12 flex items-end">
                            <button type="submit" className="bg-white p-3 rounded-full font-bold border-[.5px] hover:border-white hover:bg-blue hover:text-white">{action === 'create-product' ? 'Añadir' : 'Editar'} producto</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

function ErrorMessage({ message }) {
    return (
        <p className="text-red-500 text-sm">
            {message}
        </p>
    );
}
