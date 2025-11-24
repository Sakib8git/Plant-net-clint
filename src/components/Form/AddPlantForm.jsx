import { useForm } from "react-hook-form";
import { imageUplode } from "../../utils";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../Shared/LoadingSpinner";
import toast from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";

const AddPlantForm = () => {
  const { user } = useAuth();
  //!note: tanstack useMutation hook
  //*note: useMutation() (post|| put|| patch|| delete)
  const {
    isPending,
    isError,
    mutateAsync,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (payload) => {
      return await axios.post(
        `${import.meta.env.VITE_API_URL}/plants`,
        payload
      );
    },
    onSuccess: (data) => {
      console.log(data);
      // toast
      toast.success("Plant added successfully!");
      mutationReset();
      // query key invalidate
    },
    onError: (error) => {
      console.log(error);
    },
    onMutate: (payload) => {
      console.log("i will post this--->", payload);
    },
    onSettled: (data, error) => {
      if (data) {
        console.log(data);
      }
      if (error) {
        console.log(error);
      }
    },
    retry: 3,
  });

  // !react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  // console.log(errors);
  const onSubmit = async (data) => {
    const { name, description, quantity, price, image, category } = data;
    const imageFile = image[0];
    //* imageUplode() index.js theke asteche

    try {
      const imageUrl = await imageUplode(imageFile);
      const plantData = {
        image: imageUrl,
        name,
        description,
        category,
        quantity: Number(quantity),
        price: Number(price),
        seller: {
          email: user?.email,
          name: user?.displayName,
          image: user?.photoURL,
        },
      };
      // mutateAsync dite payload e plant data pathailam
      await mutateAsync(plantData);
      reset();
    } catch (err) {
      console.log(err);
    }
  };
  if (isPending) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  if (isError) {
    return <p>I am Error</p>;
  }
  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-1 text-sm">
              <label htmlFor="name" className="block text-gray-600">
                Name
              </label>
              <input
                className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                id="name"
                type="text"
                placeholder="Plant Name"
                {...register("name", {
                  required: "Plant name is required",
                })}
              />
              {errors.name && (
                <p className="text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
            {/* Category */}
            <div className="space-y-1 text-sm">
              <label htmlFor="category" className="block text-gray-600 ">
                Category
              </label>
              <select
                className="w-full px-4 py-3 border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                {...register("category", {
                  required: "Plant category is required",
                })}
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Succulent">Succulent</option>
                <option value="Flowering">Flowering</option>
              </select>
              {errors.category && (
                <p className="text-red-500 mt-1">{errors.category.message}</p>
              )}
            </div>
            {/* Description */}
            <div className="space-y-1 text-sm">
              <label htmlFor="description" className="block text-gray-600">
                Description
              </label>

              <textarea
                id="description"
                placeholder="Write plant description here..."
                className="block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-lime-300 bg-white focus:outline-lime-500 "
                name="description"
                {...register("description", {
                  required: "Plant description is required",
                })}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-6 flex flex-col">
            {/* Price & Quantity */}
            <div className="flex justify-between gap-2">
              {/* Price */}
              <div className="space-y-1 text-sm">
                <label htmlFor="price" className="block text-gray-600 ">
                  Price
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  id="price"
                  type="number"
                  placeholder="Price per unit"
                  {...register("price", {
                    required: "Plant Price is required",
                    min: {
                      value: 0,
                      message: "Price Must be Positive",
                    },
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 mt-1">{errors.price.message}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-1 text-sm">
                <label htmlFor="quantity" className="block text-gray-600">
                  Quantity
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  id="quantity"
                  type="number"
                  placeholder="Available quantity"
                  {...register("quantity", {
                    required: "Plant quantity is required",
                    min: {
                      value: 0,
                      message: "Quantity Must be Positive",
                    },
                  })}
                />
                {errors.quantity && (
                  <p className="text-red-500 mt-1">{errors.quantity.message}</p>
                )}
              </div>
            </div>
            {/* Image */}
            <div className=" p-4  w-full  m-auto rounded-lg grow">
              <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
                <div className="flex flex-col w-max mx-auto text-center">
                  <label>
                    <input
                      className="text-sm cursor-pointer w-36 hidden"
                      type="file"
                      id="image"
                      accept="image/*"
                      {...register("image", { required: "Image is Reqired" })}
                    />
                    {errors.image && (
                      <p className="text-red-500 mt-1">
                        {errors.image.message}
                      </p>
                    )}
                    {/* <p className="mt-1 text-xs text-gray-400">
                      PNG, JPG or JPEG (max 2MB)
                    </p> */}
                    <div className="bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-500">
                      Upload
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 "
            >
              {isPending ? (
                <TbFidgetSpinner className="animate-spin m-auto" />
              ) : (
                "Save & Continue"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPlantForm;
