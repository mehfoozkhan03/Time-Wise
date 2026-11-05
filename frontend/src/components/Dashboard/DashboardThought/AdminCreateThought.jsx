import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createAdminThought } from "../../../store/adminThoughtSlice";

import EmojiPicker from "emoji-picker-react";

import {
    HiOutlinePhoto,
    HiOutlineFaceSmile,
    HiOutlinePaperClip,
    HiOutlinePaperAirplane,
    HiOutlineXMark,
} from "react-icons/hi2";

import "./AdminCreateThought.css";

const MAX_LENGTH = 500;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 4;

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
const MAX_ATTACHMENTS = 5;

const AdminCreateThought = ({ onThoughtCreated }) => {
    const dispatch = useDispatch();

    const [content, setContent] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedAttachments, setSelectedAttachments] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const fileInputRef = useRef(null);
    const attachmentInputRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const textareaRef = useRef(null);
    const cursorPositionRef = useRef(0);
    const selectedImagesRef = useRef([]);

    const { isCreating, error } = useSelector(
        (state) => state.adminThought
    );

    const [greeting, setGreeting] = useState("Good Morning");

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();

            if (hour >= 5 && hour < 12) {
                setGreeting("Good Morning");
            } else if (hour >= 12 && hour < 17) {
                setGreeting("Good Afternoon");
            } else if (hour >= 17 && hour < 21) {
                setGreeting("Good Evening");
            } else {
                setGreeting("Good Night");
            }
        };

        updateGreeting();

        const interval = setInterval(updateGreeting, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const updateCursorPosition = () => {
        if (!textareaRef.current) return;

        cursorPositionRef.current =
            textareaRef.current.selectionStart;
    };

    const handleEmojiClick = (emojiData) => {
        const emoji = emojiData.emoji;
        const currentContent = content;

        let cursorPosition = cursorPositionRef.current;

        if (cursorPosition < 0 || cursorPosition > currentContent.length) {
            cursorPosition = currentContent.length;
        }

        const newContent =
            currentContent.slice(0, cursorPosition) +
            emoji +
            currentContent.slice(cursorPosition);

        const limitedContent = newContent.slice(0, MAX_LENGTH);

        setContent(limitedContent);

        const newCursorPosition = Math.min(
            cursorPosition + emoji.length,
            MAX_LENGTH
        );

        cursorPositionRef.current = newCursorPosition;

        requestAnimationFrame(() => {
            if (!textareaRef.current) return;

            textareaRef.current.focus();

            textareaRef.current.setSelectionRange(
                newCursorPosition,
                newCursorPosition
            );
        });
    };

    const handleEmojiToggle = () => {
        if (isCreating) return;

        updateCursorPosition();

        setShowEmojiPicker((previous) => !previous);
    };


    const handleImageChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (!files.length) return;

        const remainingSlots = MAX_IMAGES - selectedImages.length;

        if (remainingSlots <= 0) {
            alert(`You can upload a maximum of ${MAX_IMAGES} images.`);
            event.target.value = "";
            return;
        }

        const filesToProcess = files.slice(0, remainingSlots);
        const validImages = [];

        for (const file of filesToProcess) {
            if (!file.type.startsWith("image/")) {
                alert(`${file.name} is not a valid image.`);
                continue;
            }

            if (file.size > MAX_IMAGE_SIZE) {
                alert(`${file.name} is larger than 5MB.`);
                continue;
            }

            validImages.push({
                id: `${file.name}-${file.lastModified}-${Math.random()}`,
                file,
                preview: URL.createObjectURL(file),
            });
        }

        if (validImages.length > 0) {
            setSelectedImages((previousImages) => [
                ...previousImages,
                ...validImages,
            ]);
        }

        if (files.length > remainingSlots) {
            alert(`Only ${remainingSlots} more image(s) can be added.`);
        }

        event.target.value = "";
    };

    const removeImage = (id) => {
        setSelectedImages((previousImages) => {
            const imageToRemove = previousImages.find(
                (image) => image.id === id
            );

            if (imageToRemove?.preview) {
                URL.revokeObjectURL(imageToRemove.preview);
            }

            return previousImages.filter((image) => image.id !== id);
        });
    };

    const handleAttachmentChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (!files.length) return;

        const remainingSlots =
            MAX_ATTACHMENTS - selectedAttachments.length;

        if (remainingSlots <= 0) {
            alert(`You can upload a maximum of ${MAX_ATTACHMENTS} attachments.`);
            event.target.value = "";
            return;
        }

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain",
        ];

        const validFiles = [];

        for (const file of files.slice(0, remainingSlots)) {
            if (!allowedTypes.includes(file.type)) {
                alert(`${file.name} is not a supported file type.`);
                continue;
            }

            if (file.size > MAX_ATTACHMENT_SIZE) {
                alert(`${file.name} is larger than 10MB.`);
                continue;
            }

            validFiles.push({
                id: `${file.name}-${file.lastModified}-${Math.random()}`,
                file,
            });
        }

        if (validFiles.length > 0) {
            setSelectedAttachments((previous) => [
                ...previous,
                ...validFiles,
            ]);
        }

        if (files.length > remainingSlots) {
            alert(`Only ${remainingSlots} more attachment(s) can be added.`);
        }

        event.target.value = "";
    };


    const removeAttachment = (id) => {
        setSelectedAttachments((previous) =>
            previous.filter((attachment) => attachment.id !== id)
        );
    };


    useEffect(() => {
        selectedImagesRef.current = selectedImages;
    }, [selectedImages]);

    useEffect(() => {
        return () => {
            selectedImagesRef.current.forEach((image) => {
                if (image.preview) {
                    URL.revokeObjectURL(image.preview);
                }
            });
        };
    }, []);


    const handlePost = async () => {
        const isEmpty =
            !content.trim() &&
            selectedImages.length === 0 &&
            selectedAttachments.length === 0;

        if (isEmpty || isCreating) return;

        try {
            const formData = new FormData();

            // Content
            if (content.trim()) {
                formData.append("content", content.trim());
            }

            // Images
            selectedImages.forEach((image) => {
                formData.append("images", image.file);
            });

            // Attachments
            selectedAttachments.forEach((attachment) => {
                formData.append("attachments", attachment.file);
            });

            // Create Admin Thought
            await dispatch(createAdminThought(formData)).unwrap();

            // Cleanup image previews
            selectedImages.forEach((image) => {
                if (image.preview) {
                    URL.revokeObjectURL(image.preview);
                }
            });

            onThoughtCreated?.();

            // Reset form
            setContent("");
            setSelectedImages([]);
            setSelectedAttachments([]);
            setShowEmojiPicker(false);
            cursorPositionRef.current = 0;

        } catch (error) {
            console.error("Create Admin Thought Error:", error);
            alert(error || "Unable to create thought.");
        }
    };

    return (

        <section className="create_post_card">

            {/* HEADER */}
            <div className="create_post_header">
                <div className="create_post_avatar">A</div>

                <div>
                    <h3>{greeting}, Admin 👋</h3>
                    <p>Share an update with your team.</p>
                </div>
            </div>

            {/* TEXTAREA */}
            <textarea
                ref={textareaRef}
                value={content}
                maxLength={MAX_LENGTH}
                placeholder="What's on your mind, Admin?"
                onChange={(event) => {
                    setContent(event.target.value);
                    cursorPositionRef.current = event.target.selectionStart;
                }}
                onClick={updateCursorPosition}
                onKeyUp={updateCursorPosition}
                onSelect={updateCursorPosition}
                disabled={isCreating}
            />

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageChange}
            />

            <input
                ref={attachmentInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                multiple
                hidden
                onChange={handleAttachmentChange}
            />

            {selectedImages.length > 0 && (
                <div
                    className={`post_image_preview_grid image_count_${selectedImages.length}`}
                >
                    {selectedImages.map((image) => (
                        <div className="post_image_preview" key={image.id}>
                            <img
                                src={image.preview}
                                alt="Selected post preview"
                            />

                            <button
                                type="button"
                                className="remove_image_btn"
                                onClick={() => removeImage(image.id)}
                                aria-label="Remove selected image"
                            >
                                <HiOutlineXMark />
                            </button>
                        </div>
                    ))}
                </div>
            )}


            {selectedAttachments.length > 0 && (
                <div className="post_attachment_preview">
                    {selectedAttachments.map((attachment) => (
                        <div
                            className="post_attachment_item"
                            key={attachment.id}
                        >
                            <div className="post_attachment_info">
                                <HiOutlinePaperClip />
                                <span>{attachment.file.name}</span>
                            </div>

                            <button
                                type="button"
                                className="remove_attachment_btn"
                                onClick={() => removeAttachment(attachment.id)}
                                aria-label="Remove attachment"
                            >
                                <HiOutlineXMark />
                            </button>
                        </div>
                    ))}
                </div>
            )}


            {selectedAttachments.length > 0 && (
                <div className="post_attachment_preview">
                    {selectedAttachments.map((attachment) => (
                        <div
                            className="post_attachment_item"
                            key={attachment.id}
                        >
                            <div className="post_attachment_info">
                                <HiOutlinePaperClip />
                                <span>{attachment.file.name}</span>
                            </div>

                            <button
                                type="button"
                                className="remove_attachment_btn"
                                onClick={() => removeAttachment(attachment.id)}
                                aria-label="Remove attachment"
                            >
                                <HiOutlineXMark />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="tools-action-container">
                <div className="create_post_tools">

                    {/* IMAGE */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isCreating || selectedImages.length >= MAX_IMAGES}
                    >
                        <HiOutlinePhoto />
                        <span className="create_post_tool_label">Image</span>
                    </button>

                    {/* EMOJI */}
                    <div className="emoji_picker_wrapper" ref={emojiPickerRef}>
                        <button
                            type="button"
                            onClick={handleEmojiToggle}
                            disabled={isCreating}
                        >
                            <HiOutlineFaceSmile />
                            <span className="create_post_tool_label">Emoji</span>
                        </button>

                        {showEmojiPicker && (
                            <div className="emoji_picker_container">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    width={350}
                                    height={420}
                                    previewConfig={{ showPreview: false }}
                                />
                            </div>
                        )}
                    </div>

                    {/* ATTACHMENT */}
                    <button
                        type="button"
                        onClick={() => attachmentInputRef.current?.click()}
                        disabled={isCreating || selectedAttachments.length >= MAX_ATTACHMENTS}
                    >
                        <HiOutlinePaperClip />
                        <span className="create_post_tool_label">Attachment</span>
                    </button>

                </div>


                <div className="create_post_actions">
                    <span>
                        {content.length}/{MAX_LENGTH}
                    </span>

                    <button
                        className="publish_btn"
                        type="button"
                        onClick={handlePost}
                        disabled={
                            (!content.trim() &&
                                selectedImages.length === 0 &&
                                selectedAttachments.length === 0) ||
                            isCreating
                        }
                    >
                        <HiOutlinePaperAirplane />

                        {isCreating ? "Posting..." : "Publish Thought"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AdminCreateThought;