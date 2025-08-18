import React from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Label from "../components/Label";
import Textarea from "../components/Textarea";
import Select from "../components/Select";
import Checkbox from "../components/Checkbox";
import Badge from "../components/Badge";
import Card from "../components/Card";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your full name" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tell us about yourself..." />
          </div>

          <div>
            <Label htmlFor="role">Select Role</Label>
            <Select id="role">
              <option>User</option>
              <option>Employer</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Agree to terms</Label>
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>

          <div className="text-center mt-2">
            <Badge>Already have an account?</Badge>
            <a href="/login" className="text-blue-600 hover:underline ml-1">
              Log in
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
}
