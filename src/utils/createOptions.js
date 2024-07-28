export function createOptions(text = "") {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_TOKEN}`},
    body: JSON.stringify({
      message: { type: "text", text: text },
    }),
  };
}
