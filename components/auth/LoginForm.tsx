"use client";

import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../common/FormError";
import FormSuccess from "../common/FormSuccess";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  FormMessage,
} from "../ui/form";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const urLError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email Already in Use with a Different Provider"
      : "";
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    
    startTransition(() => {
      login(values)
      .then((data) => {
        // This block will only be executed if the login action returns an object,
        // which means the redirect did NOT happen (due to an error or success message).
        
        if (data?.error) {
          form.reset();
          setError(data.error);
        }
        
        if (data?.success) {
          form.reset();
          setSuccess(data.success);
        }
      })
      .catch((error) => {
          // This catch block handles the error thrown by the `redirect` function
          // when a login is successful. The `error` object will contain a `digest`
          // property used by Next.js to handle the redirect.
          if (error && error.digest && error.digest.includes("NEXT_REDIRECT")) {
            // This is the expected behavior for a successful redirect.
            // The Next.js router will handle the navigation automatically.
            return;
          }
          // For all other errors
          setError("Something went wrong");
      });
    });
  };
  
  return (
    <div className="text-slate-50 w-full max-w-md mx-auto">
      <CardWrapper
        headerLabel="Login Here "
        backButtonLabel="Don't Have an Account?"
        backButtonHref="/auth/register"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="john.doe@example.com"
                        type="email"
                        className="bg-black/20 border border-red-900/30 text-slate-100 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400 font-light" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="••••••••"
                        disabled={isPending}
                        type="password"
                        className="bg-black/20 border border-red-900/30 text-slate-100 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-400 font-light" />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error || urLError} />
            <FormSuccess message={success} />
            <Button
              size="sm"
              variant="link"
              className="px-0 font-normal text-red-400 hover:text-red-300"
            >
              <Link href="/auth/reset">Forgot Password?</Link>
            </Button>
            <Button
              variant="default"
              type="submit"
              className="w-full bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white border-0 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isPending}
            >
              Login into Your Account
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default LoginForm;
