'use client'

import {
  ErrorResponse,
  FieldError,
  ILoginRequest,
} from "@/app/core/application/dto"
import { FormField } from "@/ui/molecules/common/FormField"
import { yupResolver } from "@hookform/resolvers/yup"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("El correo es inválido")
    .required("El correo el obligatorio"),
  password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("La contraseña es obligatoria"),
})

export const LoginForm = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ILoginRequest>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(loginSchema),
  })

  const router = useRouter()
  
  const handleLogin = async (data: ILoginRequest) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: data.email,
        password: data.password,
      })

      if (result?.error) {
        handleError(JSON.parse(result.error))
        return
      }
      router.push("/dashboard/management")
    } catch (error) {
      console.log(error)
    }
  }

  const handleError = (error: unknown) => {
    const erroData = error as ErrorResponse
    if (erroData && erroData.errors) {
      if (Array.isArray(erroData.errors) && "field" in erroData.errors[0]) {
        erroData.errors.forEach((fieldError) => {
          const { field, error } = fieldError as FieldError
          setError(field as keyof ILoginRequest, {
            message: error,
          })
        })
      } else {
        if ("message" in erroData.errors[0]) {
          setError("email", {
            message: erroData.errors[0].message,
          })
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Transport Solutions S.A</h2>
          <p className="text-gray-600 text-center">
            Inicia sesion en tu cuenta y gestiona tu flota de vehiculos
          </p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <FormField<ILoginRequest>
            control={control}
            type="email"
            label="Correo electrónico"
            name="email"
            error={errors.email}
            placeholder="tuempresa@dominio.com"
          />

          <FormField<ILoginRequest>
            control={control}
            type="password"
            label="Contraseña"
            name="password"
            error={errors.password}
            placeholder="Ingresa tu contraseña"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Problemas para iniciar sesión? Contacta al administrador del sistema
        </p>
      </div>
    </div>
  )
}