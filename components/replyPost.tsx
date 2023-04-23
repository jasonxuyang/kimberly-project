import { BaseSyntheticEvent, useState } from "react";
import { CreatePostProps, createPost } from "@/utils/client";
import { ApiError, ApiResponse } from "@/utils/types";
import { mutate } from "swr";
import useRole from "@/utils/hooks/useRole";
import useAuth from "@/utils/hooks/useAuth";

export type PostReplyProps = {
  parentId: string;
  courseId?: string;
};
export default function ReplyPost({ courseId, parentId }: PostReplyProps) {
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const { currentRole } = useRole();
  const { user } = useAuth();

  const onSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const postData: CreatePostProps = {
      content: postContent,
      parentId: parentId,
      courseId: courseId,
      userAndRole:
        user && currentRole ? { id: user?.id, role: currentRole } : undefined,
    };
    const response: ApiResponse = await createPost(postData);
    if (response.success) {
      console.log("Reply created successfully");
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
        <label htmlFor="postContent">
          <input
            name="postContent"
            onChange={(e) => setPostContent(e.target.value)}
            value={postContent}
            className="text-black"
            required
          />
        </label>
        <button type="submit">Reply</button>
      </form>
    </div>
  );
}
