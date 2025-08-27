'use client';
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {UserIcon } from "lucide-react";
import CardWrapper from "./CardWrapper";
import FormError from "../common/FormError";
import FormSuccess from "../common/FormSuccess";
import { register } from "@/actions/register";
import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });
  
  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
    <CardWrapper
    headerLabel="Create an Account"
    backButtonLabel="Already Have an Account?"
    backButtonHref="/auth/login"
    showSocial
    >
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <div className="space-y-6">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <FormField
    control={form.control}
    name="firstName"
    render={({ field }) => (
      <FormItem>
      <FormLabel className="text-sm font-medium text-gray-300 hidden">
      First Name
      </FormLabel>
      <FormControl>
      <div className="relative">
      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
      {...field}
      disabled={isPending}
      placeholder="First Name"
      className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
      />
      </div>
      </FormControl>
      <FormMessage className="text-rose-500 text-xs mt-1" />
      </FormItem>
    )}
    />
    <FormField
    control={form.control}
    name="lastName"
    render={({ field }) => (
      <FormItem>
      <FormLabel className="text-sm font-medium text-gray-300 hidden">
      Last Name
      </FormLabel>
      <FormControl>
      <div className="relative">
      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
      {...field}
      disabled={isPending}
      placeholder="Last Name"
      className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
      />
      </div>
      </FormControl>
      <FormMessage className="text-rose-500 text-xs mt-1" />
      </FormItem>
    )}
    />
    </div>
    
    <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
      <FormLabel className="text-sm font-medium text-gray-300 hidden">
      Email
      </FormLabel>
      <FormControl>
      <div className="relative">
      <EnvelopeClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
      {...field}
      type="email"
      disabled={isPending}
      placeholder="you@example.com"
      className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
      />
      </div>
      </FormControl>
      <FormMessage className="text-rose-500 text-xs mt-1" />
      </FormItem>
    )}
    />
    
    <FormField
    control={form.control}
    name="password"
    render={({ field }) => (
      <FormItem>
      <FormLabel className="text-sm font-medium text-gray-300 hidden">
      Password
      </FormLabel>
      <FormControl>
      <div className="relative">
      <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
      {...field}
      type="password"
      disabled={isPending}
      placeholder="••••••••"
      className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
      />
      </div>
      </FormControl>
      <FormMessage className="text-rose-500 text-xs mt-1" />
      </FormItem>
    )}
    />
    </div>
    
    <FormError message={error} />
    <FormSuccess message={success} />
    
    <Button
    type="submit"
    disabled={isPending}
    className="w-full bg-red-800 hover:bg-red-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
    {isPending ? (
      <div className="flex items-center justify-center gap-2">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      <span>Creating Account...</span>
      </div>
    ) : (
      "Create Account"
    )}
    </Button>
    </form>
    </Form>
    </CardWrapper>
    </div>
  );
};

export default RegisterForm;