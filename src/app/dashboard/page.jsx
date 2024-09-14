"use client";

import { useContextSession } from "@/components/dashboard/Context";

import Title from "@/components/dashboard/title.jsx";
import SubTitle from "@/components/dashboard/subtitle";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const session = useContextSession();


  const cards = [
    {
      title: 'Crea tu contraseña con tu huella digital', description: '¡Ve a crear registrarte tu biométrico para que sea mucho más fácil el iniciar sesión! 😎', redirect: '/dashboard/biometric'
    },
    {
      title: 'Añade más sandías para nuestros exploradores', description: 'Puedes crear sandías desde un archivo CSV o una a una manualmente 🐈', redirect: '/dashboard/sandias'
    },
    {
      title: 'Cierra tu sesión', description: 'Sé responsable y cierra la sesión ❌', redirect: '/logout'
    },
    {
      title: 'Crea nuevos productos para vender', description: 'Añade artículos a nuestro inventario de ecommerce 💸', redirect: '/dashboard/ecommerce'
    }
  ]

  return (
    <div>
      <Title text={`¡Hola, ${session.displayName}!`} />
      <SubTitle text='Esto es lo que puedes hacer por aquí:' />

      <div className="mt-12 flex flex-wrap justify-between gap-5 gap-y-24 md:gap-y-18">
        {cards.map(({ title, description, redirect }, index) => <Card key={index} title={title} description={description} redirect={redirect} />)}
      </div>
    </div>
  );
}

function Card({ title, description, redirect }) {
  const router = useRouter()

  return <div className="w-96 h-48 rounded-3xl border-[3.5px] border-blue/70 shadow-xl flex flex-grow flex-col relative">
    <div className="absolute start-1/2 transition -translate-x-1/2 -top-4">
      <div className="rounded-full ring-8 ring-offset-2 ring-blue bg-blue/95 size-4 backdrop-contrast-0 hover:scale-110 duration-200"></div>
      <div className="absolute -top-5 start-1/2 -translate-x-1/2 ms-[2px] z-10 rotate-[190deg] border-b-[30px] border-b-blue border-s-[10px] border-e-[10px] border-s-transparent border-e-transparent"></div>
    </div>

    <h3 className="p-3 text-lg font-bold italic">{title}</h3>
    <div className="p-3 grow">
      <p>{description}</p>
    </div>
    <button className="group text-white font-bold h-11 relative transition-transform duration-200" onClick={() => router.push(redirect)}>
      <span className="absolute start-1/2 transition -translate-x-1/2 bg-blue/90 rounded-3xl w-1/4 p-3 group-hover:scale-125 backdrop-contrast-0">Ir</span>
    </button>
  </div>
}