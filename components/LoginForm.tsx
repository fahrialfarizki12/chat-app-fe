"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axiosInstance from "@/lib/Axios";
import { authSchema } from "@/lib/validations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";

//sementara menggunakan interface dulu sebelum menggunakan zod
export default function LoginFormComponent() {
  const router = useRouter();
  const formData = useForm<authSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      telepon: "",
    },
  });

  const handleSubmit = async (data: authSchema) => {
    try {
      const result = await axiosInstance.post("/users/login", data);
      formData.reset();
      //kita simpan data nya ke localstorage
      localStorage.setItem("users", JSON.stringify(result.data.data));
      router.push("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <Card className="w-full max-w-sm space-y-3">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription className="capitalize">
            enter your name and phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={formData.handleSubmit(handleSubmit)}
          >
            {/* Username Input  */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Masukkan username"
                {...formData.register("username")}
              />
              {formData.formState.errors.username && (
                <p className="text-sm text-destructive">
                  {formData.formState.errors.username.message}
                </p>
              )}
            </div>
            {/* Telepon Input */}
            <div className="space-y-2">
              <Label htmlFor="telepon">No Telepon</Label>
              <Input
                id="telepon"
                type="number"
                placeholder="Masukkan No Telepon"
                {...formData.register("telepon")}
              />

              {formData.formState.errors.telepon && (
                <p className="text-sm text-destructive">
                  {formData.formState.errors.telepon.message}
                </p>
              )}
            </div>

            <Button
              disabled={formData.formState.isSubmitting}
              type="submit"
              className="w-full cursor-pointer"
            >
              {formData.formState.isSubmitting ? (
                <>
                  <Spinner /> <p>Loading...</p>
                </>
              ) : (
                "Login"
              )}
            </Button>
            <p className="mb-4 text-center capitalize text-sm inline-flex justify-center gap-1 w-full ">
              don't have an account yet?
              <Link href="/auth/register" className="text-primary underline">
                Register Here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
