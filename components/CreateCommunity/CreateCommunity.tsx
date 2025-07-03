import React from "react";
import { createCommunity } from "./CreateCommunity.actions";

export const CreateCommunity = async () => {
  return (
    <form action={createCommunity} className="max-w-2xl mx-auto space-y-4">
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
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          name="name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          Community Description
        </label>
        <textarea
          rows={3}
          id="description"
          name="description"
          required
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {"Create"}
      </button>
    </form>
  );
};
