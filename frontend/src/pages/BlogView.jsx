import React, { useEffect, useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, MessageSquare, Share2 } from 'lucide-react'
import CommentBox from '@/components/CommentBox'
import axios from 'axios'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { setBlog } from '@/redux/blogSlice'
import { toast } from 'sonner'

const BlogView = () => {
    const params = useParams()
    const blogId = params.blogId
    const { blog } = useSelector(store => store.blog)
    const { user } = useSelector(store => store.auth)

    const selectedBlog = blog?.find(b => b._id === blogId)

    const [blogLike, setBlogLike] = useState(selectedBlog?.likes?.length || 0)
    const { comment } = useSelector(store => store.comment)
    const [liked, setLiked] = useState(selectedBlog?.likes?.includes(user?._id) || false);

    const dispatch = useDispatch()

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(
                `http://localhost:5000/api/v1/blog/${selectedBlog?._id}/${action}`,
                { withCredentials: true }
            )

            if (res.data.success) {
                const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
                setBlogLike(updatedLikes);
                setLiked(!liked)

                const updatedBlogData = blog.map(p =>
                    p._id === selectedBlog._id ? {
                        ...p,
                        likes: liked
                            ? p.likes.filter(id => id !== user._id)
                            : [...p.likes, user._id]
                    } : p
                )

                toast.success(res.data.message);
                dispatch(setBlog(updatedBlogData))
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Error")
        }
    }

    const changeTimeFormat = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    const handleShare = (blogId) => {
        const blogUrl = `${window.location.origin}/blogs/${blogId}`;

        if (navigator.share) {
            navigator.share({
                title: 'Check out this blog!',
                text: 'Read this amazing blog post.',
                url: blogUrl,
            })
        } else {
            navigator.clipboard.writeText(blogUrl).then(() => {
                toast.success('Blog link copied!');
            });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // 🔥 IMPORTANT: prevent crash
    if (!selectedBlog) {
        return <div className="p-10 text-center">Loading...</div>
    }

    return (
        <div className='pt-14'>
            <div className='max-w-6xl mx-auto p-10'>

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to={'/'}><BreadcrumbLink>Home</BreadcrumbLink></Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <Link to={'/blogs'}><BreadcrumbLink>Blogs</BreadcrumbLink></Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedBlog?.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header */}
                <div className="my-8">
                    <h1 className="text-4xl font-bold mb-4">
                        {selectedBlog?.title}
                    </h1>

                    <div className="flex justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={selectedBlog?.author?.photoUrl || ""} />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>

                            <div>
                                <p className="font-medium">
                                    {selectedBlog?.author?.firstName || "Unknown"}{" "}
                                    {selectedBlog?.author?.lastName || ""}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {selectedBlog?.author?.occupation || ""}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm text-gray-500">
                            Published on {changeTimeFormat(selectedBlog?.createdAt)}
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className="mb-8">
                    <img
                        src={selectedBlog?.thumbnail || "https://via.placeholder.com/800x400"}
                        alt="blog"
                        className="w-full rounded-lg"
                    />
                </div>

                {/* Content */}
                <div
                    dangerouslySetInnerHTML={{
                        __html: selectedBlog?.description || ""
                    }}
                />

                {/* Actions */}
                <div className="flex justify-between border-y py-4 mt-6">
                    <div className="flex gap-4">
                        <Button onClick={likeOrDislikeHandler} variant="ghost">
                            {liked ? <FaHeart className='text-red-500' /> : <FaRegHeart />}
                            <span>{blogLike}</span>
                        </Button>

                        <Button variant="ghost">
                            <MessageSquare />
                            <span>{comment?.length}</span>
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="ghost"><Bookmark /></Button>
                        <Button onClick={() => handleShare(selectedBlog._id)} variant="ghost">
                            <Share2 />
                        </Button>
                    </div>
                </div>

                <CommentBox selectedBlog={selectedBlog} />

            </div>
        </div>
    )
}

export default BlogView