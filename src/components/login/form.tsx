"use client";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
import "@/components/loaderButton.css";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { UseAuthStore } from "@/store/authStore";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  username: z.string().max(25),
  password: z.string().max(50),
});

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [visible, setVisible] = useState(false);
  const { isLoading, isAuthenticated, error, signin } = UseAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/attendance");
    }
  }, [isAuthenticated, router]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values
  ) => {
    try {
      await signin(values.username, values.password);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 p-4 rounded-lg"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <div className="relative z-0">
                <Input
                  id="username"
                  aria-label="Username"
                  className={`rounded h-[55px] md:h-[60px] ${
                    error != null ? "border-red-500" : "border-gray-400"
                  } block w-full px-4 pb-2.5 pt-5 text-lg font-semibold bg-zinc-200/70 dark:bg-black border dark:focus:border-none focus:border-white focus:ring-0 focus:outline-none peer`}
                  placeholder=" "
                  type="text"
                  {...field}
                  required
                />
                <FormLabel
                  htmlFor="username"
                  className="absolute text-md text-black/70 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Username
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="relative z-0">
                <Input
                  id="password"
                  aria-label="Password"
                  className={`rounded h-[55px] md:h-[60px] ${
                    error != null ? "border-red-500" : "border-gray-400"
                  } block w-full px-4 pb-2.5 pt-5 text-lg font-semibold bg-zinc-200/70 dark:bg-black border dark:focus:border-none focus:border-white focus:ring-0 focus:outline-none peer`}
                  placeholder=" "
                  type={visible ? "text" : "password"}
                  {...field}
                  required
                  onChange={(e) => {
                    field.onChange(e);
                    setVisible(e.target.value.length > 0 ? visible : false);
                  }}
                />
                <FormLabel
                  htmlFor="password"
                  className="absolute text-md text-black/70 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Password
                </FormLabel>
                {field.value.length > 0 && (
                  <div
                    onClick={() => setVisible((prev) => !prev)}
                    className="absolute right-3 top-4 md:top-5 text-2xl w-fit h-fit cursor-pointer"
                  >
                    {visible ? <IoMdEye /> : <IoMdEyeOff />}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <p className="text-red-500 text-sm">{JSON.stringify(error)}</p>
        )}
        <Button
          type="submit"
          className="self-center mt-4 bg-[#9cc95e] text-white text-lg px-7 py-3 rounded-lg w-full hover:shadow-lg transition-all duration-200 font-bold hover:bg-[#BFFD70] active:scale-95 active:bg-[#86af4d] disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? <div className="loader"></div> : "Log In"}
        </Button>
      </form>
    </Form>
  );
}
