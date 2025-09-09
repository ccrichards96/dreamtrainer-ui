import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useApp } from "../../contexts/useAppContext";
import { sendSupportMessage } from "../../services/api/users";
import Modal from "../modals/Modal";

interface SupportMessageFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  message: string;
  supportType:
    | "technical"
    | "course-content"
    | "billing"
    | "general"
    | "feedback";
}

type FormState = "idle" | "loading" | "success" | "error";

const SupportMessageForm: React.FC<SupportMessageFormProps> = ({
  isOpen,
  onClose,
}) => {
  const { userProfile } = useApp();
  const [formData, setFormData] = useState<FormData>({
    message: "",
    supportType: "general",
  });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      setErrorMessage("Please enter your message.");
      return;
    }

    if (!userProfile?.id || !userProfile?.email) {
      setErrorMessage("User information not available. Please try again.");
      return;
    }

    setFormState("loading");
    setErrorMessage("");

    try {
      // Prepare payload with user information
      const payload = {
        ...formData,
        userId: userProfile.id,
        email: userProfile.email,
      };

      // Use the service instead of direct fetch
      await sendSupportMessage(payload);

      setFormState("success");

      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setFormData({ message: "", supportType: "general" });
        setFormState("idle");
        onClose();
      }, 2000);
    } catch (error) {
      setFormState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
  };

  const handleClose = () => {
    if (formState !== "loading") {
      setFormData({ message: "", supportType: "general" });
      setFormState("idle");
      setErrorMessage("");
      onClose();
    }
  };

  const renderContent = () => {
    switch (formState) {
      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Message Sent Successfully!
            </h3>
            <p className="text-gray-600">
              Joseph and the Dream Trainer team will get back to you soon.
            </p>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to Send Message
            </h3>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => setFormState("idle")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        );

      default:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Support Type Selection */}
            <div>
              <label
                htmlFor="supportType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Support Type
              </label>
              <select
                id="supportType"
                name="supportType"
                value={formData.supportType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={formState === "loading"}
              >
                <option value="general">General Question</option>
                <option value="technical">Technical Support</option>
                <option value="course-content">Course Content Help</option>
                <option value="billing">Billing & Account</option>
                <option value="feedback">Feedback & Suggestions</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Please describe your question or issue in detail..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={formState === "loading"}
                required
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={formState === "loading"}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formState === "loading"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formState === "loading" ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Send a Message to Joseph and the Dream Trainer Team"
      size="lg"
      closeOnOverlayClick={formState !== "loading"}
      closeOnEscape={formState !== "loading"}
    >
      <div className="p-6">{renderContent()}</div>
    </Modal>
  );
};

export default SupportMessageForm;
