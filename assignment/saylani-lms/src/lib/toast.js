import toast from "react-hot-toast";

export function he(message, type = "success") {
  if (type === "error") toast.error(message);
  else if (type === "info") toast(message, { position: "top-right" });
  else toast.success(message);
}
