"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../clients/supabase-client";
import { useRouter } from "next/navigation";

const createCommunityMutation = async (formData: {
  name: string;
  description: string;
}) => {
  const { data, error } = await supabase.from("communities").insert({
    name: formData.name,
    description: formData.description,
  });

  if (error) throw error;

  return data;
};

export const CreateCommunity = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const {
    mutate: createCommunity,
    isPending,
    isError,
  } = useMutation({
    mutationFn: createCommunityMutation,
    onSuccess: () => {
      router.push("/communities");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCommunity(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Community
      </h2>

      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Community Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          Community Description
        </label>
        <textarea
          rows={3}
          id="description"
          required
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {isPending ? "Creating..." : "Create"}
      </button>
      {isError && <p className="text-red-500">Error creating community.</p>}
    </form>
  );
};
