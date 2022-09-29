import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "common/client/trpc";
import { guestRoute } from "common/middleware/guestRoute";
import { IRegister, registerScheme } from "common/validation/auth";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

export const getServerSideProps = guestRoute(async () => {
  return { props: {} };
});

const Register: NextPage = () => {
  const router = useRouter();

  const { register, handleSubmit } = useForm<IRegister>({
    resolver: zodResolver(registerScheme),
  });

  const { mutateAsync } = trpc.useMutation(["register"]);

  const onSubmit = useCallback(
    async (data: IRegister) => {
      const result = await mutateAsync(data);
      if (result.status === 201) {
        router.push("/login");
      }
    },
    [mutateAsync, router]
  );

  return (
    <div>
      <Head>
        <title>Next App - Register</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <form
          className="flex items-center justify-center h-screen w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Create an account!</h2>
              <input
                type="text"
                placeholder="Type your username..."
                className="input input-bordered w-full max-w-xs my-2"
                {...register("username")}
              />
              <input
                type="email"
                placeholder="Type your email..."
                className="input input-bordered w-full max-w-xs"
                {...register("email")}
              />
              <input
                type="password"
                placeholder="Type your password..."
                className="input input-bordered w-full max-w-xs my-2"
                {...register("password")}
              />
              <div className="card-actions items-center justify-between">
                <Link href="/login" className="link">
                  Go to login
                </Link>
                <button className="btn btn-secondary" type="submit">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
