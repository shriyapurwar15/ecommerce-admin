"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

// zustand for global state management
// import { Button } from "@/components/ui/button";
// import { Modal } from "@/components/ui/modal";
// import { UserButton } from "@clerk/nextjs";
const SetupPage = () => {
    const onOpen = useStoreModal((state)=>state.onOpen);
    const isOpen = useStoreModal((state)=>state.isOpen);

    useEffect(()=>{
        if(!isOpen){
            onOpen();
        }
    },[isOpen,onOpen])
    return null;
}

export default SetupPage;
