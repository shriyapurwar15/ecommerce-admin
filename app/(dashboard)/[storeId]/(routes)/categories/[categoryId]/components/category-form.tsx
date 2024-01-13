"use client";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {  Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import * as z from "zod"
import { set, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
});
type CategoryFormValues = z.infer<typeof formSchema>;


interface CategoryFormProps {
    initialData: Category | null;
    billboards : Billboard[];
}


export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            billboardId: ""
        }

    });

    const title = initialData ? "Edit Categorry" : "Create Category";
    const Description = initialData ? "Edit a Categorry" : "Add a new Category";
    const toastMessage = initialData ? "Category Updated." : "Category Created.";
    const action = initialData ? "Save changes" : "Create";


    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            }else{
                await axios.post(`/api/${params.storeId}/categories`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/categories`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Something Went Wrong");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {

            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success("Category Deleted")

        } catch (error) {
            toast.error("Make Sure you remove all products using this Category first.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={Description}
                />
                {initialData &&
                    (<Button
                        disabled={loading}
                        variant={"destructive"}
                        size={"icon"}
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4 " />
                    </Button>)}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>BillBoard</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger >
                                            <SelectValue
                                                defaultValue={field.value}
                                                placeholder="Select a billboard"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {billboards.map((billboard)=>(
                                            <SelectItem
                                                key={billboard.id}
                                                value={billboard.id}
                                            >
                                                {billboard.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
                </form>
            </Form>
            {/* <Separator /> */}

        </>
    );
};