"use client";

import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import Slider from "./slider";
import "./post-details.css";
import "../../../card.css"
import Comments from "./comments";
import { Post } from "@/app/components/post-item-card";
import { backend_url } from "@/app/settings";
import Moai from "@/app/components/moai";
import SaveButton from "@/app/components/save-button";
import TagDisplay from "./tag";

import "@/app/(main)/post/new/new-post.css";

export default ({ params: { id } }: { params: { id: string } }) => {
    const [bbox, setBbox] = useState<DOMRect | null>(null);

    const [post, setPost] = useState<Post | null>(null);

    const imgContainerRef = useCallback((node: HTMLDivElement) => {
        if (node === null)
            return;

        new ResizeObserver(() => setBbox(node.getBoundingClientRect()))
            .observe(node);
    }, []);

    useEffect(() => {
        fetch(backend_url(`/posts/${id}`), { credentials: "include" })
            .then(res => res.json())
            .then(setPost);
    }, []);

    if (post === null)
        return <h1><Moai /> Loading post… <Moai /></h1>;

    const rating = post.ratingCount === 0 ? "N/A"
        : post.rating / post.ratingCount;

    const tags = bbox === null ? [] : post.taggedClothes
        .map((tag, i) => <TagDisplay name={tag.name} x={tag.x * bbox.width} y={tag.y * bbox.height} />);

    return (
        <div className="post-container page-home">
            <div className="img-tag-container" ref={imgContainerRef}>
                <img src={backend_url(`/posts/image/${post.imageFilename}`)} />
                {...tags}
            </div>
            <div className="post-footer">
                <p className="post-caption">
                    {post.caption}
                </p>
                <SaveButton id={id} saved={post.saved} />
            </div>
            <p className="rate-text">
                <span>Rate this post:</span>
                <span className="rating">{rating}</span>
            </p>
            <Slider id={id} />
            <Comments id={id} comments={post.comments} />
        </div>
    );
};
