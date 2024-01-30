"use client";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Card,
  Skeleton
} from "@nextui-org/react";
import { DeleteIcon } from "../icons/delete";
import { toast } from "react-toastify";
import { getUserInfo } from "@/lib/helper";

const Dashboard = () => {
  const [cities, setCities] = useState<any>([]);
  const [UserInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<any>(true);

  let userInformation = getUserInfo("user_information");

  useEffect(() => {
    if (userInformation) {
      setUserInfo(userInformation);
    }
  }, [userInformation != null]);

  async function deleteCityById(cityId: any) {
    try {
      const { data, error } = await supabase
        .from("cities")
        .delete()
        .eq("id", cityId);

      if (error) {
        toast.success(`${error.message}`);
        console.error("Error deleting city:", error.message);
        throw new Error(error.message);
      } else {
        toast.success(`City deleted successfully`);
        getCities();
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      throw new Error(error.message);
    }
  }

  const columns = [
    {
      key: "countries",
      label: "Country",
    },
    {
      key: "name",
      label: "City",
    },
    {
      key: "actions",
      label: "Action",
    },
  ];

  if (UserInfo?.role !== "anon") {
    columns?.pop();
  }
  const renderCell = React.useCallback((city: any, columnKey: React.Key) => {
    const cellValue = city[columnKey as keyof any];

    switch (columnKey) {
      case "name":
        return <span>{cellValue}</span>;
      case "countries":
        return <span>{cellValue.name}</span>;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Popover key={city?.id} placement="top" color="danger">
              <PopoverTrigger>
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <DeleteIcon />
                </span>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-small font-bold">Are you sure?</div>
                  <div className="text-tiny">
                    Do you want to delete the city?
                  </div>
                  <div
                    className="text-tiny text-center mt-3 cursor-pointer hover:text-gray-200"
                    onClick={() => deleteCityById(city?.id)}
                  >
                    <strong>Yes</strong>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const getCities = async () => {
    setIsLoading(true)
    try {
      let { data: cities, error } = await supabase.from("cities").select(`
               *,
              countries (
              *
             )
           `);
      if (cities) {
        setCities(cities);
        setIsLoading(false)
      }
      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    getCities();
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      {isLoading ? 
     <Card className="w-[550px] space-y-5 p-4" radius="lg">
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg ">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
      <Skeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300"></div>
      </Skeleton>
    </Card>
    : <> 
      <div className="text-lg font-bold mb-2">
        Welcome {UserInfo?.user_metadata?.display_name} - {UserInfo?.role !== "anon" ? "Agent" : "Owner"}
      </div>
      <div className="w-[550px]">
        <h2 className="mb-4">Countries & Cities</h2>
        <Table aria-label="Countries & Cities">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={cities}>
            {(item: any) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </> }
    </div>
  );
};

export default Dashboard;
