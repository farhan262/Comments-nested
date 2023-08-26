import React, { useEffect, useState } from "react";
import {
  getComments as getCommentsApi,
  createComment as createCommentApi,
  deleteComment as deleteCommentApi,
  updateComment as updateCommentApi,
} from "../api";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
function Comments({ currentUserId }) {
  const [backendcomments, setBackendcomments] = useState([]);
  const [activecomment, setActivecomment] = useState(null);
  const rootComments = backendcomments.filter(
    (backendcomment) => backendcomment.parentId == null
  );
  // console.log("backendcomments", backendcomments);

  const getReplies = (commentId) => {
    return backendcomments
      .filter((backendcomment) => backendcomment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  const addComment = (text, parentId) => {
    console.log("addComment", text, parentId);
    createCommentApi(text, parentId).then((comment) => {
      setBackendcomments([comment, ...backendcomments]);
      setActivecomment(null);
    });
  };
  const deleteComment = (commentId) => {
    if (window.confirm("Are you sure to delete comment")) {
      deleteCommentApi(commentId).then(() => {
        const updatedBackendComments = backendcomments.filter(
          (backendComment) => backendComment.id !== commentId
        );
        setBackendcomments(updatedBackendComments);
      });
    }
  };
  const updateComment = (text, commentId) => {
    updateCommentApi(text).then(() => {
      const updatedBackendComments = backendcomments.map((backendComment) => {
        if (backendComment.id === commentId) {
          return { ...backendComment, body: text };
        }
        return backendComment;
      });
      setBackendcomments(updatedBackendComments);
      setActivecomment(null);
    });
  };
  useEffect(() => {
    getCommentsApi().then((data) => {
      setBackendcomments(data);
    });
  }, []);

  return (
    <div className="comments">
      <h3 className="comments-title">Comments</h3>
      <div className="comment-form-title">Write Comment</div>
      <CommentForm submitLabel="Write" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <div key={rootComment.id}>
            {/* {rootComment.body} */}
            <Comment
              key={rootComment.id}
              comment={rootComment}
              replies={getReplies(rootComment.id)}
              currentUserId={currentUserId}
              deleteComment={deleteComment}
              activecomment={activecomment}
              setActivecomment={setActivecomment}
              addComment={addComment}
              updateComment={updateComment}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
