import React from "react";

// Mock admins data (simulating JSON from S3)
const MOCK_ADMINS = [
  {
    firstName: "Hussain",
    lastName: "M",
    email: "admin1@petcart.com",
    phone: "9876543210",
    password: "hashed_password_1", // not shown in UI
  },
  {
    firstName: "Alice",
    lastName: "Smith",
    email: "admin2@petcart.com",
    phone: "9876500000",
    password: "hashed_password_2",
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "admin3@petcart.com",
    phone: "9998887777",
    password: "hashed_password_3",
  },
    {
    firstName: "Imam",
    lastName: "Hussain",
    email: "imam@petcart.com",
    phone: "9998887777",
    password: "hashed_password_3",
  },
    {
    firstName: "Shafi",
    lastName: "Mahammad",
    email: "shafi@petcart.com",
    phone: "9998887777",
    password: "hashed_password_3",
  },
    {
    firstName: "Hussain",
    lastName: "Mahammad",
    email: "hussain@petcart.com",
    phone: "9998887777",
    password: "hashed_password_3",
  },
];

function AdminsSection() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Admins Data</h2>
      <div className="overflow-y-auto max-h-[70vh]">
        <table className="w-full text-sm border rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">First Name</th>
              <th className="p-2 text-left">Last Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ADMINS.map((a, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{a.firstName}</td>
                <td className="p-2">{a.lastName}</td>
                <td className="p-2">{a.email}</td>
                <td className="p-2">{a.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminsSection;
