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

//time formating
export function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: any = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval >= 1) {
      return rtf.format(-interval, key as Intl.RelativeTimeFormatUnit);
    }
  }

  return "just now";
}