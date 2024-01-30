"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  AvatarIcon,
} from "@nextui-org/react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { getUserInfo } from "@/lib/helper";

export default function NavbarMenu() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [UserInfo, setUserInfo] = useState<any>(null);
  console.log(UserInfo, "UserInfo");
  
  let userInformation = getUserInfo("user_information");
  console.log(userInformation, "userInformation");

  useEffect(() => {
    if (userInformation) {
      setUserInfo(userInformation);
    }
  }, [userInformation != null]);

  const Logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`${error?.message}`);
    } else {
      toast.success("Successfully Logged Out");
      router.push("/");
      localStorage.removeItem("user_information");
      setUserInfo(null)
      getUser();
    }
  };

  const getUser = async () => {
    const getUser: Session | any = await supabase.auth.getSession();
    if (getUser) {      
      setUser(getUser?.data);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Navbar>
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <p className="font-bold text-inherit text-secondary-500"> Supabase Integration</p>
      </NavbarBrand>

      <NavbarContent className="sm:flex gap-4" justify="center">
        <NavbarItem isActive>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="dashboard" color="foreground">
            Dashboard
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* <NavbarContent as="div" justify="end">
        <NavbarItem>
          {UserInfo == null ? (
            <Link color="foreground" href="/login">
              Sign in
            </Link>
          ) : (
            <Link color="foreground" href="#" onClick={Logout}>
              Logout
            </Link>
          )}
        </NavbarItem>
      </NavbarContent> */}
      
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom">
          <DropdownTrigger>
            <Avatar
              icon={<AvatarIcon />}
              classNames={{
                base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                icon: "text-black/80",
              }}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            {UserInfo != null ? (
              <DropdownItem key="logout" color="danger" onClick={Logout}>
                <span>Log Out</span>
              </DropdownItem>
            ) : (
              <DropdownItem key="login" color="secondary">
                <Link color="foreground" href="/login">
                  Sign in
                </Link>
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
