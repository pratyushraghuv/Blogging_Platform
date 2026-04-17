import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { setBlog } from '@/redux/blogSlice'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const CreateBlog = () => {
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const {blog} = useSelector(store=>store.blog)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const getSelectedCategory = (value) => {
        setCategory(value)
    }
    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setImage(file);
    }

    const createBlogHandler = async () => {
        try {
            setLoading(true);
    
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", category);
            formData.append("description", description);
            if (image) {
                formData.append("file", image);
            }
    
            const res = await axios.post(
                "http://localhost:5000/api/v1/blog",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                }
            );
    
            if (res.data.success) {
                dispatch(setBlog([...blog, res.data.blog]));
                navigate(`/dashboard/write-blog/${res.data.blog._id}`);
                toast.success(res.data.message);
            } else {
                toast.error("Something went wrong");
            }
    
        } catch (error) {
            console.log(error);
            toast.error("Error creating blog");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className='p-4 md:pr-20 h-screen md:ml-[320px] pt-20'>
            <Card className="md:p-10 p-4 dark:bg-gray-800">
            <h1 className='text-2xl font-bold'>Lets create blog</h1>
            <p>Fill in the details below to start your new blog post.</p>
            <div className='mt-10 space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input type="text" placeholder="Your Blog Name" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white dark:bg-gray-700" />
                </div>
                
                <div>
                    <Label>Category</Label>
                    <Select onValueChange={getSelectedCategory}>
                        <SelectTrigger className="w-[180px] bg-white dark:bg-gray-700">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                <SelectItem value="Web Development">Web Development</SelectItem>
                                <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                <SelectItem value="Blogging">Blogging</SelectItem>
                                <SelectItem value="Photography">Photography</SelectItem>
                                <SelectItem value="Cooking">Cooking</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Description</Label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your blog content..."
                        rows={5}
                    />
                </div>

                <div>
                    <Label>Thumbnail Image</Label>
                    <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={changeFileHandler} 
                        className="bg-white dark:bg-gray-700" 
                    />
                </div>

                <div className='flex gap-2 pt-4'>
                    <Button className="" disabled={loading} onClick={createBlogHandler}>
                        {
                            loading ? <><Loader2 className='mr-1 h-4 w-4 animate-spin' />Please wait</> : "Create"
                        }
                    </Button>
                </div>
            </div>
            </Card>
            
        </div>
    )
}

export default CreateBlog
