import { IconButton } from "./IconButton"
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from "react-icons/fa"
import { usePost } from "../context/PostContext"
import { CommentList } from "./CommentList";
import { useState } from "react";
import { CommentForm } from "./CommentFrom";
import { useAsyncFn } from "../hooks/useAsync";
import { createComment, deleteComment, toggleCommentLike, updateComment } from "../servises/comments";
import { useUser } from "../hooks/useUser";


const dateFormatter = Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
})



export function Comment({ id, message, user, createdAt, likeCount, likedByMe }) {
    const [areChildrenHidden, setAreChildrenHidden] = useState(false)
    const { post, getReplies, createLocalComment, updateLocalComment, deleteLocalComment, toggleLocalCommentLike } = usePost();
    const [isReplay, setIsReplay] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const childComments = getReplies(id)
    const createCommentFn = useAsyncFn(createComment)
    const updateCommentFn = useAsyncFn(updateComment)
    const deleteCommentFn = useAsyncFn(deleteComment)
    const toggleCommentLikeFn = useAsyncFn(toggleCommentLike)
    const currentUser = useUser();
    console.log(currentUser)

    function onCommentReplay(message) {
        return createCommentFn
            .execute({ postId: post.id, message, parentId: id })
            .then(comment => {
                setIsReplay(false)
                createLocalComment(comment)
            })
    }

    function onCommentUpdate(message) {
        return updateCommentFn
            .execute({ postId: post.id, message, id })
            .then(comment => {
                setIsEditing(false)
                console.log(comment)
                updateLocalComment(id, comment.message)
            })
    }

    function onCommentDelete() {
        return deleteCommentFn
            .execute({ postId: post.id, id })
            .then((comment) => deleteLocalComment(comment.id))
    }

    function onToggleCommentLike() {
        return toggleCommentLikeFn.execute({
            id, postId: post.id
        }).then(({ addLike }) => toggleLocalCommentLike(id, addLike))
    }



    return (<>
        <div className="comment">
            <div className="header">
                <span className="name">{user.name}</span>
                <span className="date">{dateFormatter.format(Date.parse(createdAt))}</span>
            </div>
            {isEditing ? <CommentForm autoFocus initialValue={message} onSubmit={onCommentUpdate}
                loading={updateCommentFn.loading} error={updateCommentFn.error}
            /> : <div className="message">{message}</div>}

            <div className="footer">
                <IconButton
                    Icon={likedByMe ? FaHeart : FaRegHeart}
                    onClick={onToggleCommentLike}
                    disabled={toggleCommentLikeFn.loading}
                    aria-label={likedByMe ? 'Unlike' : 'Like'}>
                    {likeCount}</IconButton>
                <IconButton
                    Icon={FaReply}
                    isActive={isReplay}
                    onClick={() => setIsReplay(prev => !prev)}
                    aria-label={isReplay ?
                        "Cancel Replay" : "Replay"}>
                </IconButton>

                {/* {user.id === currentUser.id && ( */}
                    {/* <> */}
                        <IconButton
                            Icon={FaEdit}
                            isActive={isEditing}
                            onClick={() => setIsEditing(prev => !prev)}
                            aria-label={isEditing ?
                                "Cancel Edit" : "Edit"}>
                        </IconButton>
                        <IconButton Icon={FaTrash}
                            onClick={onCommentDelete}
                            disabled={deleteCommentFn.loading}
                            aria-label="Delete"
                            color='danger'>
                        </IconButton>

                    {/* </> */}
                {/* )} */}

            </div>
        </div>
        {deleteCommentFn.error && (
            <div className="error-msg mt-1">{deleteCommentFn.error}</div>
        )}
        {isReplay && (
            <div className="mt-1 ml-3">
                <CommentForm autoFocus onSubmit={onCommentReplay} loading={createCommentFn.loading} error={createCommentFn.error} />
            </div>
        )}
        {childComments?.length > 0 && (
            <>
                <div
                    className={`nested-comments-stack ${areChildrenHidden ? "hide" : ""
                        }`}
                >
                    <button
                        className="collapse-line"
                        aria-label="Hide Replies"
                        onClick={() => setAreChildrenHidden(true)}
                    />
                    <div className="nested-comments">
                        <CommentList comments={childComments} />
                    </div>
                </div>
                <button className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`} onClick={() => setAreChildrenHidden(false)}>
                    Show Replies</button>
            </>
        )}
    </>
    )
}