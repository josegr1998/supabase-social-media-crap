import React from "react";
import { getCommunities } from "@/actions/getCommunities";
import { createPost } from "./CreatePost.actions";

export const CreatePost = async () => {
  const communities = await getCommunities();

  return (
    <form action={createPost} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>{" "}
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>{" "}
        <textarea
          id="content"
          name="content"
          required
          rows={5}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Upload Image
        </label>{" "}
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          required
          className="w-full text-gray-200"
        />
      </div>
      <div>
        <label htmlFor="community" className="block mb-2 font-medium">
          Select Community
        </label>
        <select
          id="community"
          name="community"
          required
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        >
          <option value="">-- Choose a community --</option>
          {communities?.map((community) => (
            <option key={community.id} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        {"Create Post"}
      </button>
    </form>
  );
};
