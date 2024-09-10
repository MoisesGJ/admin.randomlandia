'use client'

import Title from "@/components/dashboard/title"
import { useEffect, useState } from "react"
import { getProducts } from "./actions"
import Image from "next/image"

export default function Ecommerce() {
    const [products, setProducts] = useState([])
    const [messageError, setMessageError] = useState(false)
    const [modalProducts, setModalProducts] = useState(false)

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
    }, [])

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


    const handleOpenModal = (id) => {
        setModalProducts(true)
    }

    return <>
        <Title text="Nuestros productos" />

        {messageError && (
            <div
                className='text-white bg-red-600 px-3 py-1 my-3 mb-5 rounded-lg font-bold'>
                {messageError}
            </div>
        )}

        {modalProducts && <ModalProducts closeModal={setModalProducts} />}

        <div className="relative overflow-x-auto mt-8 rounded-lg">
            <Table>
                {products?.map((product) => {
                    return <Row key={product._id}>
                        <HeaderCeil scope="row" classnames="font-bold whitespace-nowrap group">
                            <div className="size-20 flex justify-center items-center">
                                <Image className="hidden lg:group-hover:block" src={product.images[0]} alt={product.name} height={80} width={80} />
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
                            <button className="flex justify-center items-center gap-1 w-full h-full">
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
            <button className="hover:underline font-medium italic" onClick={handleOpenModal}>
                + Añadir otro producto
            </button>
        </div>}
    </>
}

function Skeleton() {
    return Array.from({ length: 6 }).map((__, index) => {
        return <Row key={index}>
            <HeaderCeil scope="row">
                <div className="animate-pulse w-18 h-4 bg-gray-500/30"></div>
            </HeaderCeil>
            <Ceil>
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


function Row({ children }) {
    return <tr className="odd:bg-gray-100/30 even:bg-blue/10 border-b border-gray-400">
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

function ModalProducts({ closeModal }) {
    return (
        <div
            tabindex="-1"
            className="overflow-y-auto overflow-x-hidden fixed inset-0 flex justify-center items-center w-full max-h-full z-50 backdrop-blur-sm overflow-hidden">
            <div className="relative p-4 w-full max-w-xl h-[calc(100%-1rem)]">
                <div className="relative bg-blue rounded-lg shadow p-5">
                    <div className="flex items-center justify-between p-3 md:p-5 border-b rounded-t border-white/50">
                        <h3 className="text-lg font-semibold text-white">
                            Añade un producto 🛒
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
                        <form action=""></form>
                        <ol className="relative border-s border-gray-600 ms-3.5 mb-4 md:mb-5">
                            <li className="mb-10 ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-white dark:ring-gray-700 dark:bg-gray-600">
                                    <span className="font-bold text-white text-sm">1</span>
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre del producto</label>
                                    <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 truncate" placeholder="Suéter" required />
                                </div>
                            </li>
                            <li className="mb-10 ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-white dark:ring-gray-700 dark:bg-gray-600">
                                    <span className="font-bold text-white text-sm">2</span>
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                                    <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 truncate" placeholder="Linda playera azul marino con nuestro personaje Randy, perfecta para cualquier día." required />
                                </div>
                            </li>
                            <li className="ms-8 mb-10">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-white dark:ring-gray-700 dark:bg-gray-600">
                                    <span className="font-bold text-white text-sm">3</span>
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imágenes</label>
                                    <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 truncate" placeholder="cdn.randomlandia.com/sueter1, cdn.randomlandia.com/sueter2" required />
                                </div>
                            </li>
                            <li className="ms-8">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -start-3.5 ring-8 ring-white dark:ring-gray-700 dark:bg-gray-600">
                                    <span className="font-bold text-white text-sm">4</span>
                                </span>
                                <div className="flex flex-col items-start mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    <label for="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoría</label>
                                    <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="playera" required />
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
                            <button className="bg-white p-3 rounded-full font-bold border-[.5px] hover:border-white hover:bg-blue hover:text-white">Añadir producto</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}