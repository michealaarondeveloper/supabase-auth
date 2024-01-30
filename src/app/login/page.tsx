"use client";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodError } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { getUserInfo } from "@/lib/helper";

// import {MailIcon} from './MailIcon.jsx';
// import {LockIcon} from './LockIcon.jsx';

const schema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});
type FormData = z.infer<typeof schema>;

const Login = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [UserInfo, setUserInfo] = useState<any>(null);

  let userInformation = getUserInfo("user_information");

  useEffect(() => {
    if (userInformation) {
      setUserInfo(userInformation);
    }
  }, [userInformation != null]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      let { data: user, error } = await supabase.auth.signInWithPassword({
        email: data?.email,
        password: data?.password,
      });
      if (user?.user != null) {
        toast.success("Successfully Logged in");
        router?.push("/dashboard");
        localStorage.setItem("user_information", JSON.stringify(user?.user));
      }
      if (error) {
        toast.error(`${error.message}`);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error Logging in:", error);
    }
  };

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              {UserInfo == null ? (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Log in
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Input
                        color="secondary"
                        autoFocus
                        {...register("email")}
                        label="Email"
                        placeholder="Enter your email"
                        variant="bordered"
                      />
                      {errors.email && (
                        <span className="text-red-700">
                          {errors.email.message}
                        </span>
                      )}
                      <Spacer y={3} />

                      <Input
                        color="secondary"
                        {...register("password")}
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        variant="bordered"
                      />
                      {errors.password && (
                        <span className="text-red-700">
                          {errors.password.message}
                        </span>
                      )}
                      <div className="flex py-2 px-1 justify-between">
                        <span>
                          <span>Don’t have an account </span>
                          <Link color="secondary" href="signup" size="sm">
                            Open account
                          </Link>
                        </span>
                      </div>
                      <div className="flex justify-end gap-5">
                        <Button color="danger" variant="flat" onPress={onClose}>
                          Close
                        </Button>
                        <Button type="submit" color="secondary">
                          Sign in
                        </Button>
                      </div>
                    </form>
                  </ModalBody>
                </>
              ) : (
                <>
                  <ModalHeader className="flex justify-center gap-1">
                    Successfully Logged in
                  </ModalHeader>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Login;
