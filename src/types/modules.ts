interface Course {
    id: string;
    name: string; //TOEFL Writing Max Course
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Module {
    id: string;
    courseId: string;
    topic: string; // e.g., "Introduction to TOEFL Writing"
    description: string;
    level: number; // 1-5 - difficulty level
    status: string; 
    estimatedTime: number; // Estimated time in minutes
    videoUrl: string; // URL for the video content
    botIframeUrl: string; // URL for the trainer bot
    lessonContent: string; //Rich text content for the lesson
    categoryId: string;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type { Course, Module };
