export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

export const actionDropdown = [
    {
        lable: 'Edit',
    },
    {
        lable: 'Download',
    },
    {
        lable: 'Delete',
    },
]

// text Ai
export const fetchAICompletion = async (
    data: { prompt: string; context?: string },
    onStream?: (chunk: string) => void
) => {
    const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // ✅ wrap data as JSON
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        return;
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) return;

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        onStream?.(chunk);
    }
};

// tags Ai
export const fetchAITegs = async (
    data: { title: string; message?: string },
    onStream?: (chunk: string) => void
) => {
    const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // ✅ wrap data as JSON
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        return errorText;
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) return;

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        onStream?.(chunk);
    }
};