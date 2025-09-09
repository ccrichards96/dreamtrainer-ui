import React from "react";
import Modal from "./Modal";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  description?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl = "", // Default demo video
  title = "Product Demo",
  description,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
      closeOnOverlayClick={true}
      closeOnEscape={true}
    >
      <div className="p-6">
        {description && (
          <p className="text-gray-600 mb-6 text-center">{description}</p>
        )}

        <div
          className="relative w-full"
          style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}
        >
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={videoUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-[#c5a8de] text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-[#b399d6] transition-all duration-200 transform hover:scale-105 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VideoModal;
