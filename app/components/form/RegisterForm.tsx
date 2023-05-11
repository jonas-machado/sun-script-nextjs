"use client";

import React, { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z, ZodType } from "zod";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputUseForm from "../inputs/inputWLabelUseForm";

export default function RegisterForm({ isVisible }: any) {
  const router = useRouter();

  const notify = (text: any) =>
    toast.error(text, {
      theme: "dark",
      pauseOnFocusLoss: false,
      pauseOnHover: false,

    });

  const notifySuc = (text: string) =>
    toast.success(text, {
      theme: "dark",
      pauseOnFocusLoss: false,
      hideProgressBar: false,
    });

  const schema = z
    .object({
      email: z.string().email({ message: "Email inválido" }),
      password: z.string({
        required_error: "Preencha os campos"
      }),
      confirmPassword: z.string({
        required_error: "Preencha os campos"
      }),
      name: z.string({
        required_error: "Preencha os campos"
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Senhas diferentes",
      path: ["confirmPassword"],
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
    if (errors.name) {
      notify(errors.name?.message);
    }
    if (errors.password) {
      notify(errors.password?.message);
    }
    if (errors.confirmPassword) {
      notify(errors.confirmPassword?.message);
    }
  }, [errors]);

  const handleClickRegister = async ({
    email,
    password,
    confirmPassword,
    name,
  }: FieldValues) => {
    if (errors.email) {
      notify(errors.email?.message);
    }

    await axios
      .post("/api/register", {
        email,
        password,
        name,
      })
      .then(async (res: any) => {
        if (res.data.error) {
          return notify(res.data.error);
        }
        await signIn("credentials", {
          email: email,
          password: password,
          redirect: false,
          callbackUrl: "/config/manual",
        }).then((callback) => {
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
        <h1 className="text-center text-4xl my-2">Cadastro</h1>

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
            <input
              className="transition h-10 rounded-md text-gray-400 bg-black bg-opacity-60 hover:opacity-90 w-full text-center cursor-pointer bg-[rgba(0, 0, 0, 0.455)]"
              id="register"
              type="submit"
            />
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
