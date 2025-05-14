import { useParams } from "react-router";
import { PostDetail } from "../components/PostDetail";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  return (
    <div className="pt-10">
      <PostDetail postId={postId} />
    </div>
  );
};
export default PostPage;
