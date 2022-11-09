import useUser from "./useUser";

interface UseImageUpload {
  image: FileList;
  userId: number;
  category: string;
}
export default function useImageUpload() {
  async function imageUpload({ image, userId, category }: UseImageUpload) {
    const { uploadURL } = await (await fetch("/api/files")).json();
    const form = new FormData();
    form.append("file", image[0], category + userId + "");
    const {
      result: { id },
    } = await (
      await fetch(uploadURL, {
        method: "POST",
        body: form,
      })
    ).json();
    return { id: String(id) };
  }
  return { imageUpload };
}
