// ~/FRONTEND/Truss_Main/Frontend/src/page/product/AddProduct.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import {
  productSchema,
  ProductFormValues,
} from "../../validation/listing.schema";
import FileInput from "../../component/form/FileInput";
import TextInput from "../../component/form/TextInput";
import TextareaInput from "../../component/form/TextArea";
import { productService } from "../../contracts/product/productService";
import { productApi, CreateProductRequest } from "../../services/api/productApi";
import { useWallet } from "../../context/walletContext";

const AddProduct = () => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useWallet();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    mode: "onChange",
  });

  const watchedFiles = watch("image");

  useEffect(() => {
    if (watchedFiles && watchedFiles.length > 0) {
      const fileArray = Array.from(watchedFiles);
      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
      return () => previews.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setPreviewImages([]);
    }
  }, [watchedFiles]);

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const onSubmit = async (formData: ProductFormValues) => {
    if (!account) {
      toast.error("⚠️ Please connect your wallet first");
      return;
    }

    setIsLoading(true);

    try {
      // Validate delivery date
      const deliveryDate = new Date(formData.deliveryDateTime);
      const now = new Date();
      if (deliveryDate <= now) {
        toast.error("❌ Delivery time must be in the future");
        setIsLoading(false);
        return;
      }

      // Calculate delivery time offset in seconds
      const deliveryUnix = Math.floor(deliveryDate.getTime() / 1000);
      const nowUnix = Math.floor(now.getTime() / 1000);
      const expectedDeliveryOffset = deliveryUnix - nowUnix;

      // Convert warranty duration (30 days in seconds)
      const waranteeDuration = formData.Warranty === "true" ? 30 * 24 * 60 * 60 : 0;

      toast.info("🔄 Listing product on blockchain...");

      // Step 1: List product on blockchain
      const tx = await productService.listProduct(
        formData.price.toString(),
        formData.title,
        waranteeDuration,
        expectedDeliveryOffset
      );

      toast.info("⏳ Waiting for transaction confirmation...");
      await tx.wait(); // ✅ Removed unused receipt variable

      toast.success("✅ Product listed on blockchain!");

      // Step 2: Generate product ID
      const blockchainProductId = Date.now().toString();

      // Step 3: Create product in backend database
      const productRequest: CreateProductRequest = {
        title: formData.title,
        description: formData.description || '',
        price: formData.price.toString(),
        seller: account,
        expectedDeliveryTime: expectedDeliveryOffset,
        sellerId: "1",
        waranteeDuration: waranteeDuration.toString(),
        productId: blockchainProductId
      };

      toast.info("💾 Saving product to database...");
      await productApi.createProduct(productRequest);

      // Step 4: Upload image to backend
      if (watchedFiles?.[0]) {
        toast.info("🖼️ Uploading product image...");
        await productApi.uploadProductImage(blockchainProductId, watchedFiles[0]);
      }

      // Reset form
      reset();
      setPreviewImages([]);

      toast.success(`🎉 Product fully listed! ID: ${blockchainProductId}`);

    } catch (err: any) {
      console.error("Error listing product:", err);
      
      // Enhanced error handling
      if (err.code === "ACTION_REJECTED") {
        toast.error("❌ Blockchain transaction was rejected by user");
      } else if (err.reason) {
        toast.error(`❌ Blockchain transaction failed: ${err.reason}`);
      } else if (err.message?.includes("user rejected")) {
        toast.error("❌ Transaction was rejected");
      } else if (err.message?.includes("Failed to create product")) {
        toast.error("❌ Failed to save product to database");
      } else if (err.message?.includes("Failed to upload image")) {
        toast.error("❌ Failed to upload product image");
      } else if (err.message?.includes("Cannot connect to backend")) {
        toast.error("❌ Backend server is not running");
      } else {
        toast.error(`❌ Failed to list product: ${err.message || "Unknown error"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-neutral-700 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <p className="mt-2 opacity-90">
          List your product on both blockchain and our marketplace
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white shadow-lg p-8 rounded-xl border"
      >
        {/* Image Upload */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Product Image
          </h2>
          <FileInput
            name="image"
            label="Upload Product Image"
            register={register}
            errors={errors}
            accept="image/*"
          />
          {previewImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewImages.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Product Information
          </h2>
          
          <TextInput
            name="title"
            label="Product Title *"
            register={register}
            errors={errors}
            placeholder="Enter product title"
          />
          
          <TextareaInput
            name="description"
            label="Product Description *"
            register={register}
            errors={errors}
            placeholder="Describe your product in detail"
            rows={4}
          />
          
          <div className="mt-4">
            <label className="block mb-2 font-medium text-gray-700">
              Price (USD) *
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              {...register("price")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Price will be stored on-chain with 8 decimal precision
            </p>
          </div>
        </div>

        {/* Delivery & Warranty */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Delivery & Warranty
          </h2>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">
              Expected Delivery Date & Time *
            </label>
            <input
              type="datetime-local"
              {...register("deliveryDateTime")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              defaultValue={getCurrentDateTimeLocal()}
              min={getCurrentDateTimeLocal()}
            />
            {errors.deliveryDateTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.deliveryDateTime.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Warranty Coverage *
            </label>
            <select
              {...register("Warranty")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select warranty option</option>
              <option value="true">Yes - 30 days warranty</option>
              <option value="false">No warranty</option>
            </select>
            {errors.Warranty && (
              <p className="text-red-500 text-sm mt-1">
                {errors.Warranty.message}
              </p>
            )}
          </div>
        </div>

        {/* Special Features */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Additional Information
          </h2>
          <TextareaInput
            name="specialFeatures"
            label="Special Features (Optional)"
            register={register}
            errors={errors}
            placeholder="Highlight any unique features, specifications, or additional information about your product..."
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="bg-neutral-800 text-white px-8 py-3 rounded-lg hover:bg-neutral-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Listing Product...
              </span>
            ) : (
              "List Product on Marketplace"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;