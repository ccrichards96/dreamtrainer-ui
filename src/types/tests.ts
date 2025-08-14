interface Test {
    id: string;
    courseId: string;
    name: string;
    description: string;
    videoUrl?: string;
    formLink?: string;
    richTextContent?: string; // Rich text content
    passingScore: number;
    createdAt: Date;
    updatedAt: Date;
}

interface TestAttempt {
    id: string;
    testId: string;
    userId: string;
    answerContent: string;
    score: number | null; // null if not yet graded
    passed: boolean | null; // null if not yet graded
    startedAt: Date;
    completedAt: Date | null;
}

export type { 
    Test, 
    TestAttempt
};
