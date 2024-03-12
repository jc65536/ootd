"use client";

import { useEffect, useState, MouseEvent } from "react";
import Slider from "./slider";
import "./post-details.css";
import "../../../card.css"
import Comments from "./comments";
import { Post } from "@/app/components/post-item-card";
import { backend_url } from "@/app/settings";
import Moai from "@/app/components/moai";
import SaveButton from "@/app/components/save-button";

export default ({ params: { id } }: { params: { id: string } }) => {
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        fetch(backend_url(`/posts/${id}`), { credentials: "include" })
            .then(res => res.json())
            .then(setPost);
    }, []);

    if (post === null)
        return <h1><Moai /> Loading post… <Moai /></h1>;

    const rating = post.ratingCount === 0 ? "No ratings yet."
        : post.rating / post.ratingCount;

    return (
        <div className="post-container">
            <img src={backend_url(`/posts/image/${post.imageFilename}`)} />
            <div className="post-footer">
                <p className="post-caption">
                    {post.caption}
                </p>
                <SaveButton id={id} saved={post.saved} />
            </div>
            <h4 className="rate-text">Rate this Post.</h4>
            <Slider id={id} />
            <h2 className="rate-text">{rating}</h2>
            <Comments id={id} />
        </div>
    );
};
