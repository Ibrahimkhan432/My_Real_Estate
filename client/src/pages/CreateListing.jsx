import React, { useState } from "react";
import getStorage from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase";

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        regularPrice: "",
        discountPrice: "",
        bathrooms: "",
        bedrooms: "",
        furnished: false,
        parking: false,
        type: "apartment",
        offer: false,
        imageUrls: [],
        useRef: ""
    });
    console.log(formData);

    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length < 7) {
            const promises = [];
            for (i = 0; i < files.length + formData.imageUrls.length; i++) {
                promises.push(
                    storeImage(files[i])
                )
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                    setImageUploadError(true);
                })
                .catch((err) => {
                    setImageUploadError('Image upload failed (2 mb max per image)');
                    setUploading(false);
                });

        } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };
    const storeImage = (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.log(error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            )
        });
    }

    const handleDeleteImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
            <h2 className="text-2xl font-bold mb-4">Create New Listing</h2>
            <form className="grid gap-4"
            //  onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    name="name"
                    placeholder="Property Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="number"
                    name="address"
                    placeholder="Address (Number only as per schema)"
                    value={formData.address}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="number"
                    name="regularPrice"
                    placeholder="Regular Price"
                    value={formData.regularPrice}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    name="discountPrice"
                    placeholder="Discount Price"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="number"
                    name="bathrooms"
                    min={1}
                    max={10}
                    placeholder="No. of Bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    name="bedrooms"
                    min={1}
                    max={10}
                    placeholder="No. of Bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="furnished"
                        checked={formData.furnished}
                        onChange={handleChange}
                    />
                    Furnished
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="parking"
                        checked={formData.parking}
                        onChange={handleChange}
                    />
                    Parking
                </label>

                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                    <option value="plot">Plot</option>
                </select>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="offer"
                        checked={formData.offer}
                        onChange={handleChange}
                    />
                    Special Offer
                </label>

                <div>
                    <label className="block mb-2 font-semibold">
                        Upload Images (First image will be cover image) — Max 6
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            const files = Array.from(e.target.files).slice(0, 6); // limit max 6
                            const urls = files.map((file) => URL.createObjectURL(file));
                            setFormData({ ...formData, imageUrls: urls });
                        }}
                        className="border p-2 rounded mb-2 w-full"
                    />

                    <button
                        type="button"
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                        onClick={handleImageSubmit}
                    >
                        {
                            uploading ? 'Uploading...' : 'Upload'
                        }
                    </button>
                    {formData.imageUrls.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            {formData.imageUrls.map((url, index) => (
                                <div key={url} className="relative">
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded"
                                    />
                                    <button
                                        onClick={() => handleDeleteImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded">Delete </button>
                                    {index === 0 && (
                                        <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">
                                            Cover
                                        </span>
                                    )}
                                </div>

                            ))}
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    name="useRef"
                    placeholder="Reference Code"
                    value={formData.useRef}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Create Listing
                </button>
            </form>
        </div>
    );
}
