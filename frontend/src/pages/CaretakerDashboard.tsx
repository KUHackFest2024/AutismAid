import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, User, LogOut } from "lucide-react";

// Dummy data for children
const children = [
  { id: 1, name: "Emily Thompson", age: 7, gender: "female", status: "Active" },
  {
    id: 2,
    name: "Michael Johnson",
    age: 9,
    gender: "male",
    status: "Inactive",
  },
  { id: 3, name: "Sophia Davis", age: 6, gender: "female", status: "Active" },
  { id: 4, name: "Daniel Wilson", age: 8, gender: "male", status: "Active" },
  {
    id: 5,
    name: "Olivia Martinez",
    age: 7,
    gender: "female",
    status: "Inactive",
  },
  { id: 6, name: "Ethan Brown", age: 10, gender: "male", status: "Active" },
];

const CaretakerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const viewDetails = (child: (typeof children)[0]) => {
    navigate(`/child-analysis/${child.id}`, { state: child });
  };

  const getProfileImage = (gender: string) => {
    return gender === "female"
      ? "https://cdn.pixabay.com/photo/2013/07/12/19/26/anime-154775_1280.png"
      : "https://cdn.pixabay.com/photo/2024/04/03/06/50/created-by-ai-8672238_960_720.png";
  };

  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      const matchesSearch =
        child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.age.toString().includes(searchQuery) ||
        child.id.toString().includes(searchQuery) ||
        child.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.status.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGender =
        filterGender === "all" || child.gender === filterGender;
      const matchesStatus =
        filterStatus === "all" || child.status === filterStatus;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [searchQuery, filterGender, filterStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Caretaker Dashboard
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>John Doe</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, age, ID, gender, or status"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Select onValueChange={(value) => setFilterGender(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setFilterStatus(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChildren.map((child) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={getProfileImage(child.gender)}
                        alt={child.name}
                      />
                      <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {child.name}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {child.id}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">Age: {child.age}</p>
                    <p className="text-sm text-gray-600">
                      Gender: {child.gender}
                    </p>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">
                        Status:
                      </span>
                      <Badge
                        className={
                          child.status === "Active"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }
                      >
                        {child.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => viewDetails(child)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredChildren.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No children found matching your search criteria.
          </p>
        )}
      </main>
    </div>
  );
};

export default CaretakerDashboard;
