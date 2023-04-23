import { BaseSyntheticEvent, useState } from "react";
import { CreatePostProps, createPost } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";
import { mutate } from "swr";
import useAuth from "@/utils/hooks/useAuth";
import useRole from "@/utils/hooks/useRole";

export type PostCreatorProps = {
  courseId?: string;
};
export default function CreatePost({ courseId }: PostCreatorProps) {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const { currentRole } = useRole();
  const { user } = useAuth();

  const onSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const postData: CreatePostProps = {
      title: postTitle,
      content: postContent,
      courseId: courseId,
      userAndRole:
        user && currentRole ? { id: user?.id, role: currentRole } : undefined,
    };
    const response: ApiResponse = await createPost(postData);
    if (response.success) {
      console.log("Post created successfully");
      if (courseId) {
        mutate(`/api/posts/${courseId}`);
      } else {
        mutate(`/api/posts`);
      }
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
            onChange={(e) => setPostContent(e.target.value)}
            className="text-black"
            value={postContent}
            required
          />
        </label>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}
