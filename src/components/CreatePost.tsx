import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { formatTitle } from "../lib/format";
import { fetchCommunities } from "../queries/communities";
import { supabase } from "../supabase-client";
import type { Community } from "../types/Comunity";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${formatTitle(post.title)}-${Date.now()}-${imageFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrlData } = supabase.storage.from("post-images").getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicUrlData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) =>
      createPost(data.post, data.imageFile),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });
  };

  const handleCommunityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 p-6 rounded-lg bg-zinc-900 border border-white/10 shadow-lg">
      <h3 className="text-2xl font-bold text-white">New Post</h3>

      <div>
        <label htmlFor="title" className="block mb-1 text-white font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title..."
          className="w-full bg-zinc-800 text-white border border-white/10 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="block mb-1 text-white font-medium">
          Content
        </label>
        <textarea
          id="content"
          required
          rows={5}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here..."
          className="w-full bg-zinc-800 text-white border border-white/10 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label> Select Community</label>
        <select
          id="community"
          onChange={handleCommunityChange}
          className="w-full bg-zinc-800 text-white border border-white/10 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option value={""}> -- Choose a Community -- </option>
          {communities?.map((community, key) => (
            <option key={key} value={community.id} className="bg-zinc-800 text-white">
              {community.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block mb-1 text-white font-medium">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          ref={fileInputRef}
          required={!selectedFile}
          accept="image/*"
          onChange={handleFileChange}
          className="text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
        />
      </div>

      {previewUrl && (
        <div className="relative mt-4 inline-block">
          <p className="text-sm text-white/70 mb-2">Image Preview:</p>
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full max-h-64 rounded-lg border border-white/10"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
            aria-label="Remove image">
            &times;
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !selectedFile}
        className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
        {isPending ? "Creating Post..." : "Create Post"}
      </button>

      {isError && (
        <p className="text-red-500 font-medium">Error creating post. Please try again.</p>
      )}
    </form>
  );
};
