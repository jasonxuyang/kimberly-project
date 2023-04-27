import { CreatePostProps, createPost, deletePost } from "@/utils/client";
import useAuth from "@/utils/hooks/useAuth";
import useRole from "@/utils/hooks/useRole";
import { Post, Role } from "@prisma/client";
import { HiArrowCircleRight, HiOutlineTrash } from "react-icons/hi";
import { mutate } from "swr";
import { format } from "date-fns";
import { ApiError, ApiResponse } from "@/utils/types";
import { BaseSyntheticEvent, useState } from "react";

export type PostProps = {
  postData: Post & {
    children?: Post[];
  };
  courseId?: string;
};

export const renderAuthorInfo = (
  firstName: string | null,
  datePosted?: Date
) => {
  return (
    <div className="text-sm flex items-center gap-2 text-gray-500">
      {firstName && <p>{firstName}</p>}
      {firstName && <div className="h-[3px] w-[3px] bg-black rounded-full" />}
      {datePosted && <p>{format(new Date(datePosted), "MMM dd, yyyy")}</p>}
    </div>
  );
};

export const renderAuthorActions = (
  postId: string,
  setIsDeleting: (x: boolean) => void,
  courseId?: string | null
) => {
  return (
    <div className="text-sm flex items-center gap-2">
      <button
        onClick={async () => {
          setIsDeleting(true);
          const response: ApiResponse = await deletePost({ postId: postId });
          if (response.success) {
            if (courseId) mutate(`/api/posts/${courseId}`);
            else mutate("/api/posts");
          }
          setIsDeleting(false);
        }}
      >
        <HiOutlineTrash />
      </button>
    </div>
  );
};

export const canDeletePost = (
  postUserId: string | null,
  postUserRole: Role | null,
  userId: string | undefined,
  userRole: Role | null
) => {
  return postUserId === userId && postUserRole === userRole;
};

export function PostComponent(props: PostProps) {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const [isDeleting, setIsDeleting] = useState(false);

  if (isDeleting)
    return (
      <div className="outline outline-1 outline-black p-4 rounded-md text-gray-500">
        Deleting post...
      </div>
    );
  const {
    title,
    userFirstName,
    content,
    id,
    userId,
    userRole,
    children,
    datePosted,
    courseId,
  } = props.postData;

  const renderReplies = () => {
    return (
      <div className="mt-4 flex flex-col">
        {children?.map((reply) => {
          return <ReplyComponent key={reply.id} replyData={reply} />;
        })}
      </div>
    );
  };

  return (
    <div className="outline outline-1 outline-black p-4 rounded-md">
      <div className="text-xl">{title}</div>
      <div className="text-sm mb-2 flex items-center gap-4">
        {renderAuthorInfo(userFirstName, datePosted)}
        {canDeletePost(userId, userRole, user?.id, currentRole) &&
          renderAuthorActions(id, setIsDeleting, courseId)}
      </div>
      <div className="text-base mb-2">{content}</div>
      <ReplyInputComponent parentId={id} courseId={courseId ?? undefined} />
      {renderReplies()}
    </div>
  );
}

export type ReplyProps = {
  replyData: Post;
};
export function ReplyComponent(props: ReplyProps) {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const [isDeleting, setIsDeleting] = useState(false);
  if (isDeleting)
    return (
      <div className="flex text-sm flex-col border-b-[1.5px] border-gray-100 p-4 text-gray-500">
        Deleting reply...
      </div>
    );
  const { id, content, userFirstName, datePosted, userId, userRole } =
    props.replyData;
  return (
    <div
      key={id}
      className="flex flex-col border-b-[1.5px] border-gray-100 p-4"
    >
      {content}
      <div className="text-sm flex items-center gap-4 mt-1">
        {renderAuthorInfo(userFirstName, datePosted)}
        {canDeletePost(userId, userRole, user?.id, currentRole) &&
          renderAuthorActions(id, setIsDeleting)}
      </div>
    </div>
  );
}

export type ReplyInputProps = {
  parentId: string;
  courseId?: string;
};
export default function ReplyInputComponent({
  courseId,
  parentId,
}: ReplyInputProps) {
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
    <form
      onSubmit={onSubmit}
      className="flex flex-row items-center w-full gap-2"
    >
      <label htmlFor="postContent" className="w-full">
        <input
          name="postContent"
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Type a comment..."
          value={postContent}
          className="p-2 border-b-[1.5px] px-3 text-sm w-full focus:outline-none focus:bg-gray-100 rounded-sm"
          required
        />
      </label>
      {error && <div>Error: {error}</div>}
      <button
        type="submit"
        className="text-4xl text-blue-500 hover:text-blue-600"
      >
        <HiArrowCircleRight />
      </button>
    </form>
  );
}

export type PostInputProps = {
  courseId?: string;
};
export function PostInputComponent({ courseId }: PostInputProps) {
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
    <form
      onSubmit={onSubmit}
      className="flex flex-col w-full gap-2 bg-gray-100 p-4 rounded-md"
    >
      <label htmlFor="postTitle">
        <input
          type="text"
          name="postTitle"
          placeholder="Post Title"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          className="p-2 border-b-[1.5px] px-3 text-sm w-full bg-transparent focus:outline-none focus:bg-gray-100 "
          required
        />
      </label>
      <label htmlFor="postContent">
        <textarea
          name="postContent"
          onChange={(e) => setPostContent(e.target.value)}
          className="p-2 px-3 text-sm w-full bg-transparent outline-none focus:bg-gray-100 h-24 focus:h-64 transition-all ease-in-out duration-200"
          value={postContent}
          required
        />
      </label>
      {error && <div>Error: {error}</div>}
      <button
        type="submit"
        className="bg-blue-500 font-semibold text-white py-2 rounded-md hover:bg-blue-600"
      >
        Create Post
      </button>
    </form>
  );
}
