"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spacer,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function SignUp() {
    const router = useRouter()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState<any>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {

    setIsLoading(true);
    try {
      const { data: user, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {display_name: data?.name}
          }
      });

      if (error) {
        toast.error(`${error?.message}`);
        throw new Error(error.message);
      }
      if(user?.user != null){
        toast.success("Register successfully");
        router?.push('/login')
    }
    
} catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      size="lg"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Sign up</ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className=" mx-auto rounded-lg md:w-[300px] lg:w-[500px] xl:w-[450px] 2xl:w-[800px]"
              >
                <Input
                  color="secondary"
                  type="text"
                  label="Name"
                  placeholder="Enter your name"
                  {...register("name")}
                />
                <Spacer y={3} />
                <Input
                  color="secondary"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-700">{errors.email.message}</span>
                )}
                <Spacer y={3} />
                <Input
                  color="secondary"
                  type="password"
                  label="Password"
                  placeholder="Create a password"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-red-700">
                    {errors.password.message}
                  </span>
                )}
                <div className="flex py-2 px-1 justify-between">
                    <span><span>Already have an account? </span>
                  <Link color="secondary" href="login" size="sm">
                      Sign In Now
                  </Link></span>
                </div>
                <div className="flex justify-end gap-5">
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button type="submit" color="secondary">
                    Sign up
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
