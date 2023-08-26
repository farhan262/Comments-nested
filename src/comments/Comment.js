import React from "react";
import CommentForm from "./CommentForm";
// import { updateComment } from "../api";
// import { deleteComment } from "../api";

function Comment({
  comment,
  replies,
  currentUserId,
  deleteComment,
  updateComment,
  activecomment,
  setActivecomment,
  parentId = null,
  addComment,
}) {
  const fiveMinutes = 300000;
  const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes;
  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === comment.UserId && !timePassed;
  const canDelete = currentUserId === comment.UserId && !timePassed;
  const createdAt = new Date(comment.createdAt).toLocaleDateString();
  const isReplying =
    activecomment &&
    activecomment.id === comment.id &&
    activecomment.type === "replying";
  const isEditing =
    activecomment &&
    activecomment.id === comment.id &&
    activecomment.type === "editing";
  const replyId = parentId ? parentId : comment.id;
  return (
    <div className="comment">
      <div className="comment-image-container">
        <img src="/user-icon.png" alt="" />
      </div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author">{comment.username}</div>
          <div>{createdAt}</div>
        </div>
        {!isEditing && <div className="comment-text">{comment.body}</div>}
        {isEditing && (
          <CommentForm
            submitLabel="Update"
            hasCancelButton
            initialText={comment.body}
            handleSubmit={(text) => updateComment(text, comment.id)}
            handleCancel={() => setActivecomment(null)}
          />
        )}
        <div className="comment-actions">
          {canReply && (
            <div
              className="comment-action"
              onClick={() =>
                setActivecomment({ id: comment.id, type: "replying" })
              }
            >
              Reply
            </div>
          )}
          {canEdit && (
            <div
              className="comment-action"
              onClick={() =>
                setActivecomment({ id: comment.id, type: "editing" })
              }
            >
              Edit
            </div>
          )}
          {canDelete && (
            <div
              className="comment-action"
              onClick={() => deleteComment(comment.id)}
            >
              Delete
            </div>
          )}
        </div>
        {isReplying && (
          <CommentForm
            submitLabel="Reply"
            handleSubmit={(text) => addComment(text, replyId)}
          />
        )}
        {replies.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply.id}
                replies={[]}
                currentUserId={currentUserId}
                deleteComment={deleteComment}
                updateComment={updateComment}
                parentId={comment.id}
                addComment={addComment}
                activecomment={activecomment}
                setActivecomment={setActivecomment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
