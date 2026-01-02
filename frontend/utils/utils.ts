import axios from "axios";

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
export const fetchAICompletion = async (data: { prompt: string; context?: string }) => {
    const res = await axios.post("/api/gemini", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    const reader = res.data.text;
    return reader
};

// tags Ai
export const fetchAITegs = async (data: { title: string; message?: string }) => {

    const res = await axios.post("/api/tags", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    const reader = res.data.text;
    return reader
};