'use client'

import { useEffect } from "react";
import { logOut } from "./actions";
import { useRouter } from "next/navigation";

export default function LogOut() {
    const router = useRouter();

    useEffect(() => {
        const closeSession = async () => {
            await logOut();
            router.push('/login');
        };

        closeSession();

    }, [router]);

    return 'Bye Bye';
}
