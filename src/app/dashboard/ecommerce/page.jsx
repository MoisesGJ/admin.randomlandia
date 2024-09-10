'use client'

import Title from "@/components/dashboard/title"
import { useEffect, useState } from "react"
import { getProducts } from "./actions"
import Image from "next/image"

export default function Ecommerce() {
    const [products, setProducts] = useState([])
    const [messageError, setMessageError] = useState(false)

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

    return <>
        <Title text="Nuestros productos" />

        {messageError && (
            <div
                className='text-white bg-red-600 px-3 py-1 my-3 mb-5 rounded-lg font-bold'>
                {messageError}
            </div>
        )}

        <div className="relative overflow-x-auto mt-8 rounded-lg">
            <Table>
                {(products?.length < 1) && <Skeleton />}

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
                            <button className="flex justify-center items-center w-full h-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="hidden lg:inline-block size-6 lg:group-hover:scale-150 transition-transform duration-300">
                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                </svg>

                                <span className="inline-block lg:group-hover:hidden font-medium text-blue-500">Editar</span>
                            </button>
                        </Ceil>
                    </Row>

                })}
            </Table>
        </div>
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