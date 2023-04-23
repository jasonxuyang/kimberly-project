import { BaseSyntheticEvent, useState } from "react";
import { CreatePostProps, createPost } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";
import { mutate } from "swr";

export default function CreatePost() {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState<ApiError | null>(null);

  const onSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const postData: CreatePostProps = {
      title: postTitle,
      content: postContent,
    };
    const response: ApiResponse = await createPost(postData);
    if (response.success) {
      console.log("Post created successfully");
      mutate(`/api/posts`);
    } else {
      setError(response.data.type);
      console.error(error);
    }
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}
      <form onSubmit={onSubmit}>
        <label htmlFor="postTitle">
          Post Title:{" "}
          <input
            type="text"
            name="postTitle"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="text-black"
            required
          />
        </label>
        <label htmlFor="postContent">
          Post Content:{" "}
          <textarea
            name="postContent"
            onChange={(e) => {
              console.log(e.target.value);
              setPostContent(e.target.value);
            }}
            className="text-black"
            required
          >
            {postContent}
          </textarea>
        </label>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}
