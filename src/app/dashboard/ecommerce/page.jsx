'use client'

import Title from "@/components/dashboard/title"
import { useEffect, useState } from "react"

export default function Ecommerce() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const getProductsData = async () => setProducts(await a)

        getProductsData()
    }, [])

    return <>
        <Title text="Nuestros productos" />

        <div className="relative overflow-x-auto mt-8 rounded-lg">
            <Table>
                {(products.length < 1 || !products) && <Skeleton />}

                {products?.map((product) => {
                    return <Row key={product._id}>
                        <HeaderCeil scope="row" classnames="font-bold whitespace-nowrap">
                            {product.name}
                        </HeaderCeil>
                        <Ceil>
                            {product.description}
                        </Ceil>
                        <Ceil>
                            {product.category}
                        </Ceil>
                        <Ceil>
                            $ {product.price}
                        </Ceil>
                        <Ceil>
                            <button className="font-medium text-blue-500 dark:text-blue-500 hover:underline">Editar</button>
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