import React, { useState } from "react";
// import axios from "axios";

export default function CreateListing() {
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
        imageUrls: [""],
        useRef: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageChange = (e, index) => {
        const newUrls = [...formData.imageUrls];
        newUrls[index] = e.target.value;
        setFormData({ ...formData, imageUrls: newUrls });
    };

    const addImageField = () => {
        setFormData({ ...formData, imageUrls: [...formData.imageUrls, ""] });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const res = await axios.post("http://localhost:5000/api/listings", formData);
    //         alert("Listing created successfully!");
    //         console.log(res.data);
    //     } catch (error) {
    //         console.error(error);
    //         alert("Error creating listing");
    //     }
    // };

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
    onClick={() => alert("Images uploaded successfully!")}
  >
    Upload
  </button>

  {formData.imageUrls.length > 0 && (
    <div className="grid grid-cols-3 gap-2 mt-3">
      {formData.imageUrls.map((img, index) => (
        <div key={index} className="relative">
          <img
            src={img}
            alt={`Preview ${index + 1}`}
            className="w-full h-24 object-cover rounded"
          />
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
