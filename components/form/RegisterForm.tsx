"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { BeatLoader, PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z, ZodType } from "zod";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputUseForm from "../inputs/inputUseForm";

export default function RegisterForm({ isVisible }: any) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  //função para notificações
  const notify = (text: any) => {
    toast.error(text, {
      theme: "dark",
      pauseOnFocusLoss: false,
      pauseOnHover: false,
    });
  };
  const notifySuc = (text: string) => {
    toast.success(text, {
      theme: "dark",
      pauseOnFocusLoss: false,
      hideProgressBar: false,
    });
  };

  //schema do zod
  const schema = z
    .object({
      email: z
        .string()
        .email({ message: "Email inválido" })
        .nonempty({ message: "Preencha todos os campos" }),
      password: z.string({}).nonempty({ message: "Preencha todos os campos" }),
      confirmPassword: z
        .string({})
        .nonempty({ message: "Preencha todos os campos" }),
      name: z.string({}).nonempty({ message: "Preencha todos os campos" }),
    })
    .required()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Senhas diferentes",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema),
  });

  //use effect para verificar erros nos campos
  useEffect(() => {
    for (let error in errors) {
      notify(errors[error]?.message);
    }
  }, [errors]);

  //função on submit que envia os dados para o nextauth e posteriomente para o mongoDB
  const handleClickRegister = async ({
    email,
    password,
    confirmPassword,
    name,
  }: FieldValues) => {
    setIsLoading(true);

    await axios
      .post("/api/register", {
        email,
        password,
        name,
      })
      .then(async (res: any) => {
        if (res.data.error) {
          setIsLoading(false);
          return notify(res.data.error);
        }
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
      });
  };

  return (
    <>
      <motion.div
        key="reg"
        id="container"
        className={`bg-black py-1 px-6 rounded-md bg-opacity-50 shadow-[0px_0px_40px] shadow-black w-[40rem]`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.2,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        exit={{ opacity: 0 }}
      >
        <h1 className="text-center text-4xl my-2 text-gray-200">Cadastro</h1>

        <form
          className={`col space-y-2`}
          onSubmit={handleSubmit(handleClickRegister)}
        >
          <div className="col-span-3 sm:col-span-2 ">
            <InputUseForm
              id="email"
              label="Email"
              register={register}
              error={errors}
              required
            />
          </div>
          <div className="col-span-3 sm:col-span-2">
            <InputUseForm
              id="name"
              label="Nome completo"
              register={register}
              error={errors}
              required
            />
          </div>
          <div className="col-span-3 sm:col-span-2">
            <InputUseForm
              id="password"
              label="Senha"
              register={register}
              error={errors}
              required
            />
          </div>
          <div className="col-span-3 sm:col-span-2">
            <InputUseForm
              id="confirmPassword"
              label="Confirmar Senha"
              register={register}
              error={errors}
              required
            />
          </div>

          <div className="mt-1 w-full shadow-sm">
            <button
              className="transition h-10 rounded-md text-gray-400 bg-black bg-opacity-60 hover:opacity-90 w-full text-center cursor-pointer bg-[rgba(0, 0, 0, 0.455)]"
              type="submit"
            >
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
          </div>
        </form>
        <div className=" w-full flex whitespace-nowrap mt-3 mb-2">
          <Link
            href="/"
            className="font-sans w-full text-sm ml-2 font-bold hover:text-gray-200 cursor-pointer text-gray-400 "
          >
            Já tem uma conta? <b>Clique aqui!</b>
          </Link>
        </div>
        <ToastContainer />
      </motion.div>
    </>
  );
}
