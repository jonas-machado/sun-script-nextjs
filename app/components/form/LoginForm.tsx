"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BeatLoader, PulseLoader } from "react-spinners";
import { User } from "@prisma/client";
import InputUseForm from "../inputs/inputUseForm";
import { z, ZodType } from "zod";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginProps {
  currentUser?: User | null;
}

export default function LoginForm({ currentUser }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const notify = (text: any) =>
    toast.error(text, {
      theme: "dark",
      pauseOnFocusLoss: false,
      pauseOnHover: false,
    });


  const schema: ZodType<FieldValues> = z
    .object({
      email: z.string().email({ message: "Email inválido" }),
      password: z.string().max(20),
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (errors.email) {
      notify(errors.email?.message);
    }

    if (errors.password) {
      notify(errors.password?.message);
    }

  }, [errors]);

  const handleClickLogin = async ({
    email,
    password,

  }: FieldValues) => {
    setIsLoading(true);

    await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      callbackUrl: "/config/manual",
    }).then((callback) => {
      setIsLoading(false);
      if (callback?.ok) {
        router.push("/ss/config/manual");
      }
      if (callback?.error) {
        notify(callback.error);
      }
    });
  };


  return (
    <>
      <motion.div key="login" id="container" className="bg-black py-1 px-6 rounded-md bg-opacity-50 shadow-[0px_0px_40px] shadow-black w-[25rem]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.2,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        exit={{ opacity: 0 }}
      >
        <h1 className="text-center text-5xl mb-4 text-gray-200">Login</h1>
        <form onSubmit={handleSubmit(handleClickLogin)}>
          <InputUseForm
            id="email"
            label="Email"
            register={register}
            error={errors}
            required />
          <InputUseForm
            id="password"
            label="Senha"
            register={register}
            error={errors}
            required />
          <button className="mt-1 transition h-10 rounded-md text-gray-400 bg-black bg-opacity-60 hover:opacity-90 w-full text-center cursor-pointer bg-[rgba(0, 0, 0, 0.455)]" id="register" type="submit">
            {!isLoading ? (
              <>
                <span>Enviar</span>
              </>
            ) : (
              <>
                <PulseLoader color="black" size={8} />
              </>
            )}
          </button>
        </form>
        <div className="my-2 ">
          <Link
            className={`ml-2 cursor-pointer text-gray-200`}
            href="/register"
          >
            Não tem conta? <b>Cadastre-se</b>
          </Link>
        </div>

      </motion.div>
      <ToastContainer />
    </>
  );
}
